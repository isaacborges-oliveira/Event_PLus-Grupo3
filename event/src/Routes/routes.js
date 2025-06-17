import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import CadastroEvento from "../pages/cadastroEvento/CadastroEvento";
import TipoEvento from "../pages/tipoEvento/TipoEvento";
import TipoUsuario from "../pages/tipoUsuario/TipoUsuario";
import ListagemEventos from "../pages/listagemEventos/ListagemEventos";
import Home from "../pages/home/Home";
import Usuario from "../pages/criacaousuario/CriacaoUsuario";
import { useAuth } from "../contexts/AuthContext";

const Privado = (props) => {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/" />
    }

    if (usuario.tipoUsuario !== props.tipoPermitido) {
        return <Navigate to="/" />
    }

    return <props.Item/>
}


const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} exact />
                <Route path="/Home" element={<Home />} exact />
                <Route path="/Usuario" element={<Usuario />} />
                <Route path="/Cadastro" element={<Privado tipoPermitido ="Administrador" Item={CadastroEvento}/>} />
                <Route path="/TipoEvento" element={<Privado tipoPermitido ="Administrador" Item={TipoEvento}/>}/>
                <Route path="/TipoUsuario" element={<Privado tipoPermitido ="Administrador" Item={TipoUsuario}/>} />
                <Route path="/ListagemEvento" element={<Privado tipoPermitido ="aluno" Item={ListagemEventos}/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;