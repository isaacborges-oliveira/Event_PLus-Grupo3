    import "./Login.css"
    import Swal from "sweetalert2";

    import api from "../../services/Services";
    import Logo from "../../assets/img/LogoNovaa.png"
    import Botao from "../../components/botao/Botao"

    import secureLocalStorage from "react-secure-storage";
    import { useState } from "react";
    import { userDecodeToken } from "../../auth/Auth";
    import { Link } from "react-router-dom";

    import { useNavigate } from "react-router";
    import { useAuth } from "../../contexts/authContext";

    const Login = () => {
        const [email, setEmail] = useState("");
        const [senha, setSenha] = useState("");

        const navigate = useNavigate();

        const { setUsuario } = useAuth();

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

        async function realizarAutenticacao(e) {
            e.preventDefault();

            try {
                const usuario = {
                    email: email,
                    senha: senha
                }

                if (senha.trim() !== "" || email.trim() !== "") {
                    try {
                        const resposta = await api.post("login", usuario);
                        
                        const token = resposta.data.token;

                        if (token) {
                            // token será decodificado
                            const tokenDecodificado = userDecodeToken(token);
                            
                            // console.log("token decodificado:",);
                            // console.log(tokenDecodificado.tipoUsuario);

                            setUsuario(tokenDecodificado);

                            secureLocalStorage.setItem("tokenLogin", JSON.stringify(tokenDecodificado));

                            if (tokenDecodificado.tipoUsuario === "aluno") {
                                //redirecionar a tela de aluno(branca)
                                navigate("/Listagem")
                            } else {
                                //ela vai me encaminhar para tela de cadastro de eventos(verelho)
                                navigate("/Evento")
                            }
                        }

                        alertar("success", "Login Realizado com sucesso!")

                    } catch (error) {
                        console.log(error);
                        alertar("error", "Credênciais incorretas!");
                    }
                } else {
                    alertar("warning", "Preencha os campos vazios para realizar o login!")
                }


            } catch (error) {
                console.log(error);
            }
        }

        return (
            <main className="main_login">

                <div className="banner">
                    <div id="fundo_login" />
                </div>

                <section className="section_login">
                    <img src={Logo} alt="Logo do Event" />

                    <form action="" className="form_login" onSubmit={realizarAutenticacao}>

                        <div className="campos_login">
                            <div className="campo_input">
                                <input type="Email" name="email"
                                    placeholder="Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="campo_input">
                                <input type="PassWord" name="senha"
                                    placeholder="PassWord"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                        </div>
                        <Link to="/cadastrarUsuario" href="">Criar uma Conta?</Link>
                        <Botao botao="Login" />
                    </form>
                </section>
            </main>
        )
    }

    export default Login;