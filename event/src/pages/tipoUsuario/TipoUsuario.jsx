import "./TipoUsuario.css";
import { Fragment, useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Cadastro from "../../components/cadastro/Cadastro";
import Listagem from "../../components/lista/Lista";
import banner from "../../assets/img/mulhermedia-removebg-preview.png";

import Swal from 'sweetalert2'
import api from "../../Services/services";



const TipoUsuario = () => {
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [listaTipoUsuario, setListaTipoUsuario] = useState([]);

    function alertar(icone, mensagem) {
        //------------ALERTA------------------

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

        //----------FIM DO ALERTA--------------
    }


    async function cadastrarTipoUsuario(e) {
        e.preventDefault();
        if (tipoUsuario.trim() != "") {

            try {
                await api.post("tiposUsuarios", { TituloTipoUsuario: tipoUsuario });
                alertar("success", "sucesso! Cadastro realizado")
                setTipoUsuario("");

            } catch (error) {
                console.log(error);

            }

        } else {
            alertar("error", "Erro! preencha os campos")
        }
    }

    async function listarTipoUsuario() {
        try {
            const resposta = await api.get("TiposUsuarios");
            setListaTipoUsuario(resposta.data);
        } catch (error) {
            console.log(error);

        }
    }

    async function deletarTipoUsuario(id) {
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!"
        });

        if (!confirm.isConfirmed) return;
        try {
            await api.delete(`TiposUsuarios/${id.idTipoUsuario}`);
            listarTipoUsuario();
        } catch (error) {
            console.log(error);
        }
        Swal.fire({
            title: "Deletado!",
            text: "Deletado com sucesso.",
            icon: "success"
        });
    }


    async function editarTipoUsuario(tipoUsuario) {
        const { value: novoTipo } = await Swal.fire({
            title: "Modifique seu tipo evento",
            input: "text",
            inputLabel: "Novo tipo genero",
            inputValue: tipoUsuario.tituloTipoUsuario,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "O campo precisa estar preenchido!";
                }
            }
        });
        if (novoTipo) {
            try {
                await api.put(`TiposUsuarios/${tipoUsuario.idTipoUsuario}`, { TituloTipoUsuario: novoTipo });

                Swal.fire(`tipo usuario modificado para: ${novoTipo}`);
            } catch (error) {
                console.log(error);

            }

        }
    }

    useEffect(() => {
        listarTipoUsuario();
    }, [listaTipoUsuario])


    return (
        <Fragment>
            <Header adm="Administrador" />
            <main>
                <Cadastro titulo="Tipo De Usuario" imagem={banner} placeholder="Titulo"
                    funcCadastro={cadastrarTipoUsuario}
                    valorInput={tipoUsuario}
                    setValorInput={setTipoUsuario}
                    visivel="none"
                    visibilidade="none" />
                <Listagem
                    tituloLista="Lista Tipos de Usuarios"
                    visivel="none"
                    tipo="Tipo Usuario"
                    lista={listaTipoUsuario}
                    funcExcluir={deletarTipoUsuario}
                    funcEditar={editarTipoUsuario}
                    tipoLista="tiposUsuarios"  
                    visivelD="none"
                    visivelTipo="none"
                    visivelDt="none"
                    visivelEV="none"
                />


            </main>
            <Footer />
        </Fragment>
    )
}
export default TipoUsuario;