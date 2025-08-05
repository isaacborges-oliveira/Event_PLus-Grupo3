import { useEffect, useState } from "react";
import imgDeletar from "../../assets/img/deletar.svg";
import "./Modal.css"

import Swal from 'sweetalert2'

import api from "../../Services/services";

import { useAuth } from "../../contexts/AuthContext";

const Modal = (props) => {

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

    const [comentarios, setComentarios] = useState([])
    // const [usuarioId, setUsuarioId] = useState("B2381F43-9D74-400D-B3ED-FD05D20E9885")
    const { usuario } = useAuth();
    const [novoComentario, setNovoComentario] = useState("")


    async function listarComentarios() {
        try {
            const resposta = await api.get(`ComentariosEventos/ListarSomenteExibe?id=${props.idEvento}`);
            setComentarios(resposta.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        listarComentarios()
    }, [comentarios])

    async function cadastrarComentario(comentario) {
        try {
            console.log(usuario.idUsuario)
            console.log(props.idEvento)
            console.log(comentario)
            Swal.fire({
                title: 'Enviando comentário...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await api.post("ComentariosEventos", {

                idUsuario: usuario.idUsuario,
                idEvento: props.idEvento,
                descricao: comentario
            })

            Swal.fire({
                icon: 'success',
                title: 'Comentário enviado com sucesso!'
            });




        } catch (error) {
            // console.log(error.response.data);

            alertar("error", error.response.data)
            Swal.fire({
                icon: 'error',
                title: 'Erro ao enviar comentário',
                text: 'Tente novamente mais tarde.'
            });
        }
    }

    async function deletarComentario(idComentario) {
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
                                        <img src={imgDeletar} alt="deletar"
                                            onClick={() => deletarComentario(item.idComentarioEvento)} />
                                        <p>{item.descricao}</p>
                                        <hr />
                                    </div>
                                ))}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Escreva seu comentario..."
                                        value={novoComentario}
                                        onChange={(e) => setNovoComentario(e.target.value)}
                                    />
                                    <button
                                        className="botao"
                                        onClick={() => cadastrarComentario(novoComentario)}>
                                        Cadastrar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default Modal;