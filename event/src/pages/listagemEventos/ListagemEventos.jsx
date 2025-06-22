import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";

import api from "../../services/Services";

import Modal from "../../components/modal/Modal";
import Swal from "sweetalert2";

import "./ListagemEventos.css"

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import Comentario from "../../assets/img/Comentario.svg"
import Informacao from "../../assets/img/Informacao.svg"
import Toggle from "../../components/toggle/Toggle";

const ListagemEventos = (props) => {
    const [listaEventos, setListaEventos] = useState([]);

    //Modal:
    const [tipoModal, setTipoModal] = useState("");     //"descricaoevento" ou "comentario"
    const [dadosModal, setDadosModal] = useState({});   // descrição, idEvento, etc.
    const [modalAberto, setModalAberto] = useState(false);

    //Filtro
    const [filtro, setFiltro] = useState(["todos"]);

    const { usuario } = useAuth();

    // const [usuarioId, setUsuarioId] = useState("2CC2DD9B-0814-4FB1-98AF-AE511A8D4E4C");

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: icone,
            title: mensagem
        });
    }

    async function listarEventos() {
        try {
            //pego os eventos em geral
            const resposta = await api.get("Eventos");
            const todosOsEventos = resposta.data;

            const respostaPresenca = await api.get("PresencasEventos/ListarMinhas/" + usuario.idUsuario)
            const minhasPresencas = respostaPresenca.data;

            const eventosComPresencas = todosOsEventos.map((atualEvento) => {
                const presenca = minhasPresencas.find(p => p.idEvento === atualEvento.idEvento);

                return {
                    //AS INFORMACOES TANTO DE EVENTOS QUANTO DE EVENTOS QUE POSSUEM PRESENCA
                    ...atualEvento,// Mantém os dados originais do evento atual
                    possuiPresenca: presenca?.situacao === true,
                    idPresenca: presenca?.idPresencaEvento || null
                }
            })

            setListaEventos(eventosComPresencas);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarEventos();
    }, [])

    function abrirModal(tipo, dados) {
        //Tipo de modal
        //dados
        setModalAberto(true);
        setTipoModal(tipo);
        setDadosModal(dados);
    }

    function fecharModal() {
        setModalAberto(false);
        setDadosModal({});
        setTipoModal("");
    }

    async function manipularPresenca(idEvento, presenca, IdPresencaEvento) {
        try {
            if (presenca && IdPresencaEvento !== "") {
                // Atualiza: situação para false (remover presença)
                await api.put(`PresencasEventos/${IdPresencaEvento}`, { situacao: false });
                alertar("success", "Sua presença foi removida.")
            } else if (IdPresencaEvento !== "" && IdPresencaEvento != null) {
                // Atualiza: situação para true (confirmar presença)
                await api.put(`PresencasEventos/${IdPresencaEvento}`, { situacao: true });
                alertar("success", "Sua presença foi confirmada.")
            } else {
                // Cria nova presença
                await api.post("PresencasEventos", { situacao: true, idUsuario: usuario.idUsuario, idEvento: idEvento });
                alertar("success", "Sua presença foi confirmada.")
            }
            listarEventos();
        } catch (error) {
            console.error(error);
            alertar("error", "Algo deu errado ao manipular presença.")
        }
    }

    function filtrarEventos() {
        const hoje = new Date();

        return listaEventos.filter(evento => {
            const dataEvento = new Date(evento.dataEvento);

            if (filtro.includes("todos")) return true;
            if (filtro.includes("futuros") && dataEvento > hoje) return true;
            if (filtro.includes("passados") && dataEvento < hoje) return true;
            return false;
        });
    }

    return (
        <>
            <Header
                botao_logar="none"
            />
            <main>
                <section className="layout_grid listagem_section">
                    <div className="titulo_listagem">
                        <h1>Eventos</h1>
                        <hr />
                    </div>

                    <div className="listagem_eventos">
                        <select name="eventos"
                            value={props.valorSelect}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="todos" selected>Todos os Eventos</option>
                            <option value="futuros" selected>Somente Futuros</option>
                            <option value="passados" selected>Somente Passados</option>
                        </select>
                    </div>

                    <div className="list">
                        <table>
                            <thead>
                                <tr className="list_tabela">
                                    <th>Titulo</th>
                                    <th>Data do Evento</th>
                                    <th>Tipo Evento</th>
                                    <th>Descrição</th>
                                    <th>Comentários</th>
                                    <th>Participar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaEventos.length > 0 ? (
                                    filtrarEventos() && filtrarEventos().map((item) => (

                                        <tr className="list_presenca">
                                            <td data-cell="Titulo">{item.nomeEvento}</td>
                                            <td data-cell="Data do Evento">{new Date(item.dataEvento).toLocaleDateString('pt-BR')}</td>
                                            <td data-cell="Tipo Evento">{item.tiposEvento.tituloTipoEvento}</td>

                                            <td data-cell="Descricao">
                                                <img src={Informacao}
                                                    alt="Exclamação de Descrição"
                                                    onClick={() => abrirModal("descricaoEvento", { descricao: item.descricao })}
                                                />
                                            </td>

                                            <td data-cell="Comentario" >
                                                <img src={Comentario}
                                                    alt="Comentário"
                                                    onClick={() => abrirModal("comentarios", { idEvento: item.idEvento })}
                                                />
                                            </td>

                                            <td data-cell="botao">
                                                <Toggle
                                                    presenca={item.possuiPresenca}
                                                    manipular={() => manipularPresenca(item.idEvento, item.possuiPresenca, item.idPresenca)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>erro</p>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <Footer visibilidade="none" />

            {modalAberto && (
                <Modal
                    titulo={tipoModal === "descricaoEvento" ? "Descrição do evento" : "comentario"}

                    //estou verificando qual é o tipo de modal!
                    tipoModel={tipoModal}

                    idEvento={dadosModal.idEvento}

                    descricao={dadosModal.descricao}

                    fecharModal={fecharModal}
                />
            )}
        </>
    );
}

export default ListagemEventos;