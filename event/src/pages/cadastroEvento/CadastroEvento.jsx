import "./CadastroEvento.css";
import { Fragment, useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Cadastro from "../../components/cadastro/Cadastro";
import Listagem from "../../components/lista/Lista";
import banner from "../../assets/img/cadastroeventos.svg"


import Swal from 'sweetalert2'
import api from "../../Services/services";


const Cadastrar = () => {
    const [evento, setEvento] = useState("");
    const [dataEvento, setDataEvento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [instituicao, setInstituicao] = useState("23E29B9F-96F8-45DD-9046-81561687FC08");
    const [tipoEvento, setTipoEvento] = useState("");
    const [listaTipoEvento, setListaTipoEvento] = useState([])
    const [listaEvento, setListaEvento] = useState([])
    const [excluirEvento, setExcluirEvento] = useState([])

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
            const resposta = await api.get("tiposEventos");
            setListaTipoEvento(resposta.data);
        } catch (error) {
            console.log(error);

        }

    }

    async function deletarEvento(id) {
        try {
            const excluirEvento = await api.delete(`eventos/${id.idEvento}`)
            setExcluirEvento(excluirEvento.data)
            alertar("success", "deletado com sucesso!");
        }
        catch (error) {
            alertar("error", "Erro ao deletar")
        }
    }


    async function listarEvento() {
        try {
            const resposta = await api.get("Eventos")
            setListaEvento(resposta.data)
            // listarEvento();

        } catch (error) {
            console.log(error);

        }
    }

    function DescricaoEvento(item) {
        Swal.fire({
            title: 'Descrição do Evento',
            text: item.descricao || "Nenhuma descrição disponível",
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
    }

    async function cadastrarEvento(evt) {
        evt.preventDefault();
        if (evento.trim() !== "") {
            try {
                await api.post("Eventos", { nomeEvento: evento, idTipoEvento: tipoEvento, dataEvento: dataEvento, descricao: descricao, idInstituicao: instituicao });
                alertar("success", "Cadastro realizado com sucesso!");
                setEvento("");
                setDataEvento();
                setDescricao("");
                setTipoEvento("");
                listarEvento();

            } catch (error) {
                alertar("error", "Entre em contato com o suporte")
            }
        } else {
            alertar("error", "Preencha o campo vazio")

        }
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

      
           await api.put(`Eventos/${evento.idEvento}`, {
                nomeEvento: value.campo1,
                dataEvento: value.campo2,
                idTipoEvento: value.campo3,
                descricao: value.campo4,
                idInstituicao: "23E29B9F-96F8-45DD-9046-81561687FC08"
            });

            alertar("success", "Dados salvos com sucesso.");
            
            listarEvento();
        } catch (error) {
            console.log("Deu ruim aqui");
            alertar("error", "Não foi possível atualizar.");
        }
    }

    useEffect(() => {
        listarTipoEvento();
        listarEvento();
    }, [listaEvento]);


    return (
        <Fragment>
            <Header adm="Administrador" />
            <main>
                <Cadastro titulo="Cadastro de Evento" placeholder="Nome:"
                    imagem={banner}
                    funcCadastro={cadastrarEvento}

                    valorInput={evento}
                    setValorInput={setEvento}

                    valorSelect={tipoEvento}
                    setValorSelect={setTipoEvento}



                    setValorText={setDescricao}
                    valorText={descricao}

                    setValorSelect1={setInstituicao}
                    valorSelect1={instituicao}

                    setValorDate={setDataEvento}
                    valorDate={dataEvento}

                    lista={listaTipoEvento}


                />

                <Listagem tituloLista="Lista eventos"
                    lista={listaEvento}
                    tipoLista="Eventos"
                    funcExcluir={deletarEvento}
                    funcEditar={editarEvento}
                    funcDescricao={DescricaoEvento}
                    tipo="Data Evento"
                // funcEditar={editarEvento}/

                />
            </main>

            <Footer />
        </Fragment>
    )
}

export default Cadastrar;