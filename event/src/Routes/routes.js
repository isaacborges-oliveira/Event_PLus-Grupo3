import { BrowserRouter, Route, Routes, Navigate } from "react-router";

//Telas do Site
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import ListagemEventos from "../pages/listagemEventos/ListagemEventos";
import CadastroEvento from "../pages/cadastroEvento/CadastroEvento";
import CadastroTipoEvento from "../pages/cadastroTipoEvento/CadastroTipoEvento";
import CadastroTipoUsuario from "../pages/cadastroTipoUsuario/CadastroTipoUsuario";
import CadastraUsuario from "../pages/cadastrarUsuario/CadastrarUsuario"
import { useAuth } from "../contexts/authContext";

const Privado = (props) => {
    const { usuario } = useAuth();
    // token, idUsuario, tipoUsuario

    // Se não estiver autenticadi, manda para login
    if (!usuario) {
        return <Navigate to="/" />
    }

    // Se o tipo do usuário não for o permitido, bloqueia
    if (usuario.tipoUsuario !== props.tipoPermitido) {
        // Ir para a tela de não encontrado!
        return <Navigate to="/" />;
    }

    // Se não, renderiza o compomente passado
    return <props.Item />;
};

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Login />} path="/" exact />
                <Route element={<Home />} path="/Home" exact />
                <Route element={<CadastraUsuario />} path="/CadastrarUsuario" exact />
                <Route element={<Privado tipoPermitido="admin" Item={CadastroEvento} />} path="/Evento" />
                <Route element={<Privado tipoPermitido="aluno" Item={ListagemEventos} />} path="/Listagem" />
                <Route element={<Privado tipoPermitido="admin" Item={CadastroTipoEvento} />} path="/TipoEvento" />
                <Route element={<Privado tipoPermitido="admin" Item={CadastroTipoUsuario} />} path="/TipoUsuario" />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;