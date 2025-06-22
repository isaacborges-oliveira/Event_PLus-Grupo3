import "./CadastrarUsuario.css"

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from '../../services/Services';

import Banner from "../../assets/img/cadastroUsuario.png"
import Botao from "../../components/botao/Botao";
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const CriacaoUsuario = () => {
    const [listaTipoUsuario, setListaTipoUsuario] = useState([]);
    const [criarUsuario, setCriarUsuario] = useState(""); 
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
        const navigate = useNavigate();

    useEffect(() => {
        listarTipoUsuario();
    }, []);

    async function listarTipoUsuario() {
        try {
            const resposta = await api.get("TiposUsuarios");
            setListaTipoUsuario(resposta.data);
        } catch (error) {
            console.error("Erro ao buscar tipos de usuário:", error);
        }
    }

    async function cadastrarUsuario(event) {
        event.preventDefault(); 

        if (tipoUsuario.trim() !== "" && criarUsuario.trim() !== "" && email.trim() !== "" && senha.trim() !== "") {
            try {
                await api.post("Usuario", {
                    nomeUsuario: criarUsuario,
                    email: email,
                    senha: senha,
                    idTipoUsuario: tipoUsuario
                });

                Swal.fire("Sucesso", "Cadastro realizado com sucesso", "success");
                setCriarUsuario("");
                setEmail("");
                setSenha("");
                setTipoUsuario("");

                navigate("/home")
            } catch (error) {
                Swal.fire("Erro", "Erro! entre em contato com o suporte!", "error");
                console.log(error);
            }
        } else {
            Swal.fire("Atenção", "Preencha todos os campos", "warning");
        }
    }

    return (
        <>
            <Header
            visibilidade="none"
            visibilidade2="none" />

            <section className="section_cadastro">
                <form className="layout_grid form_cadastro_usuario" onSubmit={cadastrarUsuario}>
                    <div className="div_titulo">
                        <h1>Cadastro de Usuário</h1>
                        {/* <hr /> */}
                    </div>

                    <div className="imagem_form">
                        <div className="img">
                            <img src={Banner} alt="Imagem Cadastro" />
                        </div>

                        <div className="campo_cadastro">
                            <div className="campo_cadNome">
                                <label htmlFor="nome"></label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    placeholder="Nome"
                                    value={criarUsuario}
                                    onChange={(e) => setCriarUsuario(e.target.value)}
                                />
                            </div>
                            <div className="campo_cadNome">
                                <label htmlFor="email"></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="campo_cadNome">
                                <label htmlFor="senha"></label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>
                            <div className="campo_Instituiçao  campo_cadNome">
                                <label htmlFor="idTipoUsuario"></label>
                                <select
                                    id="idTipoUsuario"
                                    name="idTipoUsuario"
                                    value={tipoUsuario}
                                    onChange={(e) => setTipoUsuario(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Selecione o tipo de usuário
                                    </option>
                                    {listaTipoUsuario.map((item) => (
                                        <option key={item.idTipoUsuario} value={item.idTipoUsuario}>
                                            {item.tituloTipoUsuario}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Botao botao="Cadastrar" />
                        </div>
                    </div>
                </form>
            </section>

            <Footer />
        </>
    );
};

export default CriacaoUsuario;