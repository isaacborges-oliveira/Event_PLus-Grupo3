import { useState, useEffect } from "react";
import api from "../../services/Services";

//Importar o seu SweetAlert
import Swal from 'sweetalert2';

import Cadastro from "../../components/cadastro/Cadastro";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Imagem from "../../assets/img/tipoevento (1) (1) (1).png"
import Lista from "../../components/lista/Lista";

const CadastroTipoEvento = () => {
    const [tiposEventos, setTiposEventos] = useState("");
    const [listaTipoEventos, setListaTipoEventos] = useState([]);

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

    async function cadastrarTipoEvento(e) {
        e.preventDefault();

        if (tiposEventos.trim() !== "") {
            try {
                await api.post("TiposEventos", { TituloTipoEvento: tiposEventos });
                alertar("success", "Cadastro realizado com sucesso");
                setTiposEventos("");
            } catch (error) {
                console.log(error);
                alertar("error", "Erro! Entre em contato com o suporte!");
            }
        } else {
            alertar("warning", "Preencha o campo!")
        }

    }

    async function listarTipoEvento() {
        try {
            const resposta = await api.get("TiposEventos");

            setListaTipoEventos(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function editarTipoEvento(tiposEventos) {
        const { value: novoTipoEvento } = await Swal.fire({
            title: "Modifique seu Tipo Evento",
            input: "text",
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            inputLabel: "Novo Tipo Evento",
            inputValue: tiposEventos.tituloTipoEvento,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "O campo não pode estar vazio!";
                }
            }
        });
        if (novoTipoEvento) {
            try {
                await api.put(`tiposEventos/${tiposEventos.idTipoEvento}`,
                    { TituloTipoEvento: novoTipoEvento });
                alertar("success", "Tipo Evento Modificado!")
            } catch (error) {

            }
            Swal.fire(`Seu novo Tipo Evento: ${novoTipoEvento}`);
        }
    }

    async function deletarTipoEvento(id) {
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
                await api.delete(`tiposEventos/${id.idTipoEvento}`);
                alertar("success", "Tipo Evento Excluido!");
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Excluir!");
        })
    }

    useEffect(() => {
        listarTipoEvento();
    }, [listaTipoEventos]);

    return (
        <>
            <Header
                botao_logar="none"
            />
            <main>
                <Cadastro
                    titulo_cadastro="Cadastro de Tipo Eventos"
                    campo_placeholder="Titulo"

                    visibilidade="none"
                    visibilidade_data="none"
                    visibilidade_tp_evento="none"
                    visibilidade_instituicao="none"
                    visibilidade_descricao="none"

                    botao="Cadastrar"
                    banner_img={Imagem}

                    funcCadastro={cadastrarTipoEvento}
                    valorInput={tiposEventos}
                    setValorInput={setTiposEventos}
                />

                <Lista
                    titulo_lista="Tipo Eventos"
                    titulo="Titulo"
                    visibilidade="none"

                    lista={listaTipoEventos}
                    tipoLista="TiposEventos"

                    funcEditar={editarTipoEvento}
                    funcDeletar={deletarTipoEvento}
                    visibilidade2="none"
                />
            </main>
            <Footer />
        </>
    )
}

export default CadastroTipoEvento;