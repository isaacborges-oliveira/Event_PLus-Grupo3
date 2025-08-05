import "./Header.css";
import Logo from "../../assets/img/LogoNovaa.png";
import { Link } from "react-router-dom"
import Porta from "../../assets/img/icon.svg"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";

const Header = (props) => {
const [menuAberto, setMenuAberto] = useState(false);

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };


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
            confirmButtonColor: '#210144',
            cancelButtonColor: '#210144',
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
                <Link to="/">
                    <img src={Logo} className="sagui" alt="Logo do Event Plus" />
                </Link>

                {/* Botão hambúrguer */}
                <button style={{display:props.visivelHamburg}} className="hamburguer" onClick={toggleMenu}>
                    ☰
                </button>

                <nav className={`nav_header ${menuAberto ? "ativo" : ""}`}>
                    <Link className="link_header" to="/Home">Home</Link>
                    <Link className="link_header" to="/TipoEvento">Eventos</Link>
                    <Link className="link_header" to="/TipoUsuario">Usuarios</Link>
                    <Link className="link_header" to="/Contatos" style={{ display: props.visivelHeader }}>Contatos</Link>
                    <Link className="link_header" to="/Administrador">{props.adm}</Link>
                </nav>

                <Link onClick={() => realizarLogOut()}>
                    <img src={Porta} alt="Imagem de porta" className="porta" />
                </Link>


            </div>

        </header>
    )
}

export default Header;