import "./ListagemEventos.css"
import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import comentario from "../../assets/img/comentario.svg";
import Toggle from "../../components/toggle/Toggle";
import descricao from "../../assets/img/descricao2.svg";

import Modal from "../../components/modal/Modal";
import api from "../../Services/services";

import { format } from "date-fns";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

const ListagemEventos = (props) => {

    const [listaEvento, setListaEvento] = useState([])
    // const [verEvento, setVerEventos] = useState([])
    const [tipoModal, setTipoModal] = useState("")
    const [dadosModal, setDadosModal] = useState([])

    const [modalAberto, setModalAberto] = useState(false)

    const [filtro, setFiltro] = useState(["todos"])
    // const [usuarioId, setUsuarioId] = useState("B2381F43-9D74-400D-B3ED-FD05D20E9885")

    const { usuario } = useAuth();

    async function listarEventos() {
        try {
            //pego o eventos em geral
            const resposta = await api.get("Eventos");
            const todosOsEventos = resposta.data;
            // console.log(todosOsEventos);
            
            const respostaPresencas = await api.get("PresencasEventos/ListarMinhas/" + usuario.idUsuario)
            const minhasPresencas = respostaPresencas.data;
            // console.log(minhasPresencas);
            
            const eventosComPresencas = todosOsEventos.map((atualEvento) => {
                const presenca = minhasPresencas.find(p => p.idEvento === atualEvento.idEvento);
                return {
                    ...atualEvento,

                    IdPresencaEvento: presenca?.idPresencaEvento || null,
                    possuiPresenca: presenca?.situacao === true,
                }
            })

            setListaEvento(eventosComPresencas)

        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        }
    }


    useEffect(() => {
        listarEventos();
        // console.log(usuario);
    }, [])

    function abrirModal(tipo, dados) {
        //Tipo de modal, dados do modal 
        setModalAberto(true)
        setDadosModal(dados);
        setTipoModal(tipo);
    }

    function fecharModal() {
        setModalAberto(false);
        setDadosModal({})
        setTipoModal("")
    }

    async function manipularPresenca(idEvento, presenca, idPresenca) {
        console.log(idEvento, usuario.idUsuario);
        
        try {
            if (presenca && idPresenca != null) {
                console.log("aq1");
                
                //atualizacao: situacao para FALSE
                await api.put(`PresencasEventos/${idPresenca}`, { situacao: false });
                Swal.fire('Removido!', 'Sua presenca foi removida.', 'success');
            } else if (idPresenca != null) {
                console.log("aq2");
                
                //atualizacao: situacao para TRUE
                await api.put(`PresencasEventos/${idPresenca}`, { situacao: true });
                Swal.fire('Confirmado!', 'Sua presenca foi confirmada.', 'success');
            } else {
                console.log("aq3");
                
                //cadastrar uma nova presenca
                await api.post("PresencasEventos", { situacao: true, idUsuario: usuario.idUsuario, idEvento: idEvento });
                Swal.fire('Confirmado!', 'Sua presenca foi confirmada.', 'success');
            }

            listarEventos()
        } catch (error) {
            console.log(error);
        }
    }

    function filtrarEventos() {
        const hoje = new Date();
        return listaEvento.filter(evento => {
            const dataEvento = new Date(evento.dataEvento);

            if (filtro.includes("todos")) return true;
            if (filtro.includes("futuros") && dataEvento > hoje) return true;
            if (filtro.includes("passados") && dataEvento < hoje) return true;
            return false;
        })
    }

    return (
        <>
            <Header adm="Alunos"
            visivelHeader="none" />
            <main className="listaEventos layout_grid">
                <section className="listagemEventos" id="">
                    <h1>Eventos</h1>
                    <hr />

                    <div className="tabela_eventos">

                        <select className="select"
                            value={props.valorSelect}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="todos" selected>Todos os Eventos</option>

                            <option value="futuros">Somente Futuros</option>

                            <option value="passados">Somente Passados</option>


                        </select>

                        <table>
                            <thead>
                                <tr className="table_eventos">
                                    <th>Titulo</th>
                                    <th>Data do Evento</th>
                                    <th>Tipo Eventos</th>
                                    <th>Descriçao</th>
                                    <th>Comentarios</th>
                                    <th>Participar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listaEvento.length > 0 ? (
                                    filtrarEventos() && filtrarEventos().map((item) => (

                                        <tr key={item.idEvento} className="item_listaEventos">
                                            <td data-cell="Nome">{item.nomeEvento}</td>
                                            <td data-cell="Data">{format(item.dataEvento, "dd/MM/yyyy")}</td>
                                            <td data-cell="Tipo Evento">{item.tiposEvento.tituloTipoEvento}</td>

                                            <td data-cell="descricao">
                                                <button className="icon" onClick={() =>
                                                    abrirModal("descricaoEvento", { descricao: item.descricao })}>
                                                    <img src={descricao} alt="descricao" />
                                                </button></td>

                                            <td data-cell="comentario">
                                                <button className="icon" onClick={() => abrirModal("comentarios", { idEvento: item.idEvento })}>
                                                    <img src={comentario} alt="" />
                                                </button>
                                            </td>

                                            <td data-cell="botao"><Toggle presenca={item.possuiPresenca}
                                                manipular={() => manipularPresenca(item.idEvento, item.possuiPresenca, item.IdPresencaEvento)
                                                } /></td>
                                        </tr>
                                    )
                                    )
                                )
                                    : <p>Nao ah eventos</p>

                                }
                            </tbody>


                        </table>
                    </div>


                </section>
            </main>

            <Footer />

            {modalAberto && (
                <Modal
                    titulo={tipoModal == "descricaoEvento" ? "Descriçao do Evento" : "Comentarios"}
                    tipoModel={tipoModal}
                    idEvento={dadosModal.idEvento}
                    descricao={dadosModal.descricao}
                    fecharModal={fecharModal}
                />
            )}

        </>
    )

}
export default ListagemEventos;



