import "./Header.css";
import Logo from "../../assets/img/LogoNovaa.png";
import Icone from "../../assets/img/Administracao.svg";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";

const Header = (props) => {

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

    const navigate = useNavigate();

    async function realizarLogOut(e) {
        Swal.fire({
            title: 'Sair?',
            text: "Essa ação poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, Sair!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const resposta = secureLocalStorage.removeItem("tokenLogin");
                console.log(resposta);

                alertar("success", "Até Logo!");

                navigate("/home")
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Sair");
        })
    }

    return (
        <header>
            <div className="layout_grid cabecalho">
                <Link to="/" className="logo_header">
                    <img src={Logo} alt="Logo do Events" />
                </Link>

                <nav className="nav_header">
                    <Link href="" className="link_header" to="/Home">Home</Link>
                    <Link href="" className="link_header" to="/Evento">Eventos</Link>
                    <Link href="" className="link_header" to="/TipoEvento">TpEvento</Link>
                    <Link href="" className="link_header" to="/TipoUsuario">Usuários</Link>
                    <Link href="" className="link_header" to="/Listagem">Listagem</Link>
                </nav>

                <nav className="nav_img" to="/" style={{ display: props.visibilidade }}>
                    <Link href="" className="link_header" >Alunos</Link>
                    <img src={Icone} onClick={() => realizarLogOut()} alt="Icone" style={{ display: props.visibilidade }} />
                </nav>

                <div className="login" style={{ display: props.botao_logar }}>
                    <Link href="" to="/" className="logar">Logar</Link>
                </div>
            </div>
        </header>
    )
}

export default Header;