import "./TipoEvento.css"
import { Fragment, useEffect, useState } from "react";
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import Cadastro from "../../components/cadastro/Cadastro";
import Listagem from "../../components/lista/Lista";
import banner from "../../assets/img/tipoevento.png"

import Swal from 'sweetalert2'
import api from "../../Services/services";

const TipoEvento = () => {

    const [tipoEvento, setTipoEvento] = useState("");
    const [listaTipoEvento, setListaTipoEventos] = useState("");

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

    async function cadastrarTipoEvento(e) {
        e.preventDefault();
        if (tipoEvento.trim() != "") {

            try {
                await api.post("tiposEventos", { TituloTipoEvento: tipoEvento });
                alertar("success", "sucesso! Cadastro realizado")
                setTipoEvento("");

            } catch (error) {
                console.log(error);

            }

        } else {
            alertar("error", "Erro! preencha os campos")
        }
    }

    async function listarTipoEvento() {
       
        try {
            const resposta = await api.get("tiposEventos");
            setListaTipoEventos(resposta.data);
        } catch (error) {
            console.log(error);

        }
    }

    async function deletarTipoEvento(id) {
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
            await api.delete(`TiposEventos/${id.idTipoEvento}`);
            listarTipoEvento();
        } catch (error) {
            console.log(error);
        }
         Swal.fire({
                    title: "Deletado!",
                    text: "Deletado com sucesso.",
                    icon: "success"
                });
    }

    async function editarTipoEvento(tipoEvento) {
        const { value: novoTipo } = await Swal.fire({
            title: "Modifique seu tipo evento",
            input: "text",
            inputLabel: "Novo tipo genero",
            inputValue: tipoEvento.tituloTipoEvento,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "O campo precisa estar preenchido!";
                }
            }
        });
        if (novoTipo) {
            try {
                await api.put(`tiposEventos/${tipoEvento.idTipoEvento}`, { TituloTipoEvento: novoTipo });
                Swal.fire(`tipo evento modificado para: ${novoTipo}`);
            } catch (error) {
                console.log(error);

            }

        }
    }
    

    useEffect(() => {
        listarTipoEvento();
    }, [listaTipoEvento])


    return (
        <Fragment>
            <Header adm="Administrador"/>
            <main>
                <Cadastro titulo="Tipo De Evento" visivel="none"
                    imagem={banner} placeholder="Titulo"
                    funcCadastro={cadastrarTipoEvento}
                    valorInput={tipoEvento}
                    setValorInput={setTipoEvento} 
                    visibilidade="none"/>
                <Listagem tituloLista="Lista Tipo De Eventos" visivel="none"
                    lista={listaTipoEvento}
                    funcExcluir={deletarTipoEvento}
                    funcEditar={editarTipoEvento} 
                    tipoLista="tiposEventos"
                    visivelD="none"
                    tipo="Titulo"
                    visivelTipo="none"
                    visivelDt="none"
                    visivelEV="none"
                    />
            </main>
            <Footer/>
        </Fragment>
    )
}


export default TipoEvento;