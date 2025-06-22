import "./Modal.css"

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";

import api from "../../services/Services";
import Swal from "sweetalert2";

import imgDeletar from "../../assets/img/Deletar.svg"

const Modal = (props) => {
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");

    const { usuario } = useAuth();

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

    async function listarComentarios() {
        try {
            const resposta = await api.get(`ComentariosEventos/ListarSomenteExibe?id=${props.idEvento}`)

            setComentarios(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarComentarios();
    }, [])

    async function cadastrarComentario(comentario) {
        if (comentario.trim() !== "") {
            let timerInterval;
            Swal.fire({
                title: "Auto close alert!",
                html: "I will close in <b></b> milliseconds.",
                timer: 500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then(async (result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    try {
                        console.log(usuario.idUsuario);
                        console.log(props.idEvento);
                        console.log(comentario);
                        await api.post("ComentariosEventos", {
                            idUsuario: usuario.idUsuario,
                            idEvento: props.idEvento,
                            descricao: comentario
                        })

                        alertar("success", "Cadastro realizado com sucesso");
                    } catch (error) {
                        console.log(error);
                        alertar("error", "Erro! Entre em contato com o suporte!");
                    }
                }
            });
        } else {
            alertar("warning", "Preencha o campo!");
        }
    }

    function deletarComentario(idComentario) {
        Swal.fire({
            title: 'Tem Certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`comentariosEventos/${idComentario}`);
                alertar("success", "Comentário Excluido!");
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Excluir!");
        })
    }

    return (
        <>
            <div className="model-overlay" onClick={props.fecharModal}>

                <div className="model" onClick={(e) => e.stopPropagation()}>
                    <h1>{props.titulo}</h1>
                    <div className="model_conteudo">
                        {props.tipoModel === "descricaoEvento" ? (
                            <p>{props.descricao}</p>
                        ) : (
                            <>
                                {comentarios.map((item) => (
                                    <div key={item.idComentarioEvento}>
                                        <strong>{item.usuario.nomeUsuario}</strong>

                                        <img
                                            src={imgDeletar}
                                            alt="Deletar"
                                            onClick={() => deletarComentario(item.idComentarioEvento)}
                                        />

                                        <p>{item.descricao}</p>
                                        <hr />
                                    </div>
                                ))}
                                <div>
                                    <input
                                        type="text" placeholder="Escreva seu comentário..."
                                        value={novoComentario}
                                        onChange={(e) => setNovoComentario(e.target.value)}
                                    />

                                    <button
                                        onClick={() => cadastrarComentario(novoComentario)}
                                        className="botao">
                                        cadastrar
                                    </button>
                                </div  >
                            </>
                        )}
                    </div>
                </div >
            </div>
        </>
    )
}

export default Modal