import { useEffect, useState } from "react";
import api from "../../services/Services";
import Swal from "sweetalert2";

import Imagem from "../../assets/img/cadastro.png"
import Cadastro from "../../components/cadastro/Cadastro";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Lista from "../../components/lista/Lista";

const CadastroEvento = () => {
    const [listaEvento, setListaEvento] = useState([]);
    const [listaTipoEvento, setlistaTipoEvento] = useState([]);
    const [instituicoes, setInstituicoes] = useState("79FF1CF4-7BDB-4788-A502-25781226E880");
    const [tipoEvento, setTipoEvento] = useState("");
    const [dataEvento, setDataEvento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [evento, setEvento] = useState("");

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

    async function listarTipoEvento() {
        try {
            const resposta = await api.get("TiposEventos");

            setlistaTipoEvento(resposta.data)
        } catch (error) {
            console.log(error);
        }
    }

    async function cadastrarEvento(e) {
        e.preventDefault();

        if (evento.trim() !== "") {
            try {
                await api.post("eventos", {
                    DataEvento: dataEvento,
                    NomeEvento: evento, Descricao: descricao,
                    IdTipoEvento: tipoEvento,
                    IdInstituicao: instituicoes
                });

                alertar("success", "Cadastro realizado com sucesso")
                setEvento("");
                setDataEvento("");
                setDescricao("");
                setTipoEvento("");

            } catch (error) {
                alertar("error", "Erro! Entre em contato com o suporte!")
                console.log(error);

                console.log({
                    DataEvento: dataEvento,
                    NomeEvento: evento,
                    Descricao: descricao,
                    IdTipoEvento: tipoEvento,
                    IdInstituicao: instituicoes
                });
            }
        } else {
            alertar("warning", "Preencha o campo!")
        }
    }

    async function listarEvento() {
        try {
            const resposta = await api.get("Eventos");

            setListaEvento(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function deletarEvento(id) {
        Swal.fire({
            title: 'Tem Certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await api.delete(`eventos/${id.idEvento}`);
                alertar("success", "Evento Excluido!");
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Excluir!");
        })
    }

    async function editarEvento(evento) {
        try {
            const tiposOptions = listaTipoEvento
                .map(tipo => `<option value="${tipo.idTipoEvento}" ${tipo.idTipoEvento === evento.idTipoEvento ? 'selected' : ''}>${tipo.tituloTipoEvento}</option>`)
                .join('');

            const { value } = await Swal.fire({
                title: "Editar Tipo de Evento",
                html: `
            <input id="campo1" class="swal2-input" placeholder="Título" value="${evento.nomeEvento || ''}">
            <input id="campo2" class="swal2-input" type="date" value="${evento.dataEvento?.substring(0, 10) || ''}">
            <select id="campo3" class="swal2-select">${tiposOptions}</select>
            <input id="campo4" class="swal2-input" placeholder="Categoria" value="${evento.descricao || ''}">
            `,
                showCancelButton: true,
                confirmButtonText: "Salvar",
                cancelButtonText: "Cancelar",
                focusConfirm: false,
                preConfirm: () => {
                    const campo1 = document.getElementById("campo1").value;
                    const campo2 = document.getElementById("campo2").value;
                    const campo3 = document.getElementById("campo3").value;
                    const campo4 = document.getElementById("campo4").value;

                    if (!campo1 || !campo2 || !campo3 || !campo4) {
                        Swal.showValidationMessage("Preencha todos os campos.");
                        return false;
                    }

                    return { campo1, campo2, campo3, campo4 };
                }
            });

            await api.put(`eventos/${evento.idEvento}`, {
                nomeEvento: value.campo1,
                dataEvento: value.campo2,
                idTipoEvento: value.campo3,
                descricao: value.campo4,
            });

            alertar("success", "Dados salvos com sucesso.");
            listarEvento();
        } catch (error) {
            alertar("error", "Não foi possível atualizar.");
        }
    }

    async function exibirDescricao(item) {
        Swal.fire({
            title: 'Descrição do Evento',
            text: item.descricao || "Nenhuma descrição disponível",
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
    }

    useEffect(() => {
        listarEvento();
        listarTipoEvento();
    }, [listaEvento]);

    return (
        <>
            <Header
                botao_logar="none"
            />
            <main>
                <Cadastro
                    titulo_cadastro="Cadastro de Eventos"
                    campo_placeholder="Nome"
                    campo_descricao="Descrição"
                    botao="Cadastrar"
                    banner_img={Imagem}

                    valorInput={evento}
                    setValorInput={setEvento}

                    //Cadastrar evento
                    funcCadastro={cadastrarEvento}

                    // Obter data
                    valorData={dataEvento}
                    setValorData={setDataEvento}

                    //Obter descricao 
                    valorInputDescricao={descricao}
                    setValorInputDescricao={setDescricao}

                    // Obter TipoEvento 
                    valorTpEvento={tipoEvento}
                    setValorTpEvento={setTipoEvento}

                    // Obter Instituições
                    valorInstituicao={instituicoes}
                    setValorInstituicao={setInstituicoes}

                    // Listar TipoEvento
                    lista={listaTipoEvento}
                />

                <Lista
                    titulo_lista="Eventos"
                    titulo="Nome"

                    tipoLista="Eventos"
                    lista={listaEvento}

                    funcDeletar={deletarEvento}
                    funcEditar={editarEvento}

                    funcDescricao={exibirDescricao}
                />
            </main>
            <Footer />

        </>
    )
}

export default CadastroEvento;