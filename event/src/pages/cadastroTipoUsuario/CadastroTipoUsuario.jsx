import { useState, useEffect } from "react";
import api from "../../services/Services";

//Importar o seu SweetAlert
import Swal from 'sweetalert2';

import Cadastro from "../../components/cadastro/Cadastro";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Imagem from "../../assets/img/mulhermedia-removebg-preview (1).png"
import Lista from "../../components/lista/Lista";

const CadastroTipoUsuario = () => {
    const [listaTipoUsuario, setListaTipoUsuario] = useState([])
    const [tiposUsuarios, setTiposUsuario] = useState("");


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

    async function cadastrarTipoUsuario(e) {
        e.preventDefault();

        if (tiposUsuarios.trim() !== "") {
            try {
                await api.post("tiposUsuarios", { TituloTipoUsuario: tiposUsuarios });

                alertar("success", "Cadastro realizado com sucesso");
                setTiposUsuario("");
            } catch (error) {
                alertar("error", "Erro! Entre em contato com o suporte!");
                console.log(error);
            }
        } else {
            alertar("warning", "Preencha o campo!");
        }
    }

    async function listarTipoUsuario() {
        try {
            const resposta = await api.get("TiposUsuarios");
            setListaTipoUsuario(resposta.data);
        } catch (error) {
            console.log(console.error);
        }
    }

    async function deletarTipoUsuario(id) {
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
                await api.delete(`tiposUsuarios/${id.idTipoUsuario}`);
                alertar("success", "TipoUsuario Excluido!");
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Excluir!");
        })
    }

    async function editarTipoUsuario(tiposUsuarios) {
        const { value: novoTipoUsuario } = await Swal.fire({
            title: "Modifique seu Tipo Usuario",
            input: "text",
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            inputLabel: "Novo Tipo Usuario",
            inputValue: tiposUsuarios.tituloTipoUsuario,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "O campo não pode estar vazio!";
                }
            }
        });
        if (novoTipoUsuario) {
            try {
                await api.put(`tiposUsuarios/${tiposUsuarios.idTipoUsuario}`,
                    { tituloTipoUsuario: novoTipoUsuario });
                alertar("success", "Tipo Evento Modificado!")
            } catch (error) {

            }
            Swal.fire(`Seu novo Tipo Evento: ${novoTipoUsuario}`);
        }
    }

    useEffect(() => {
        listarTipoUsuario();
    }, [listaTipoUsuario])


    return (
        <>
            <Header
                botao_logar="none"
            />
            <main>
                <Cadastro
                    titulo_cadastro="Cadastro de Tipo Usuário"
                    campo_placeholder="Titulo"
                    botao="Cadastrar"
                    banner_img={Imagem}

                    visibilidade="none"
                    visibilidade_data="none"
                    visibilidade_tp_evento="none"
                    visibilidade_instituicao="none"
                    visibilidade_descricao="none"


                    funcCadastro={cadastrarTipoUsuario}
                    valorInput={tiposUsuarios}
                    setValorInput={setTiposUsuario}
                />

                <Lista
                    titulo_lista="Tipo Usuário"
                    titulo="Titulo"
                    visibilidade="none"

                    tipoLista="tiposUsuarios"
                    lista={listaTipoUsuario}

                    funcDeletar={deletarTipoUsuario}
                    funcEditar={editarTipoUsuario}
                    visibilidade2="none"
                    visibi_del_edit="none"
                />
            </main>
            <Footer />
        </>
    )
}

export default CadastroTipoUsuario;