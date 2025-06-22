import "./Home.css"
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer"

import Banner from "../../assets/img/EventbannerAzul.png"
import Mapa from "../../assets/img/Mapppsa.png"
import Visao from "../../assets/img/VisaoAzull.png"
import { useEffect, useState } from "react";
import api from "../../services/Services";


const Home = (props) => {
    const [listaEventos, setListaEventos] = useState([]);

    async function listarEventos() {
        try {
            const resposta = await api.get("eventos");

            setListaEventos(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarEventos();
    }, [])

    return (
        <>
            <Header
                visibilidade="none" />
            <main>
                <section className="home_section">
                    <div className="pagina_home">
                        <img src={Banner} alt="" />
                    </div>

                    <div className="lista_eventos layout_grid">
                        <div className="titulo">
                            <h1>Próximos Eventos</h1>
                            <hr />
                        </div>

                        <div className="proximos_eventos">
                            {listaEventos.length > 0 ? (
                                listaEventos.map((item) => (
                                    <article className="item">
                                        <h1>{item.nomeEvento}</h1>

                                        <p>{item.descricao}</p>

                                        <button>Conectar</button>
                                    </article>
                                ))
                            ) :
                                (
                                    <article className="item">
                                        <h1>Não á eventos</h1>

                                        <p>Breve descrição do evento, pode ser um paragrafo pequeno</p>

                                        <button>Conectar</button>
                                    </article>
                                )
                            }
                        </div>
                    </div>

                    <div className="visao">
                        <img src={Visao} alt="" />
                    </div>

                    <div className="contato">
                        <div className="titulo_2">
                            <h1>Contato</h1>
                            <hr />
                        </div>

                        <div className="mapa_informacoes layout_grid">
                            <div className="mapa">
                                <img src={Mapa} alt="" />
                            </div>

                            <div className="informacoes_contato">
                                <p>Rua Niterói, 180 - Centro</p>
                                <p>São Caetano  do  Sul - SP</p>
                                <p>(11) 4225-2000</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </>
    )
}

export default Home;