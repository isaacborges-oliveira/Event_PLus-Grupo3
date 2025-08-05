import "./Lista.css";
import editar from "../../assets/img/editar.svg";
import excluir from "../../assets/img/excluir.svg";
import Detalhes from "../../assets/img/descricao.svg"

import { format } from "date-fns";

const Listagem = (props) => {
    return (
        <section className="listagem">
            <h1>{props.tituloLista}</h1>
            <hr className="hr_listagem" />

            <div className="tabela layout_grid">
                <table>
                    <thead>
                        <tr className="table_cabecalho">
                            <th style={{ display: props.visivel }}>Nome</th>
                            <th>{props.tipo}</th>
                            <th style={{ display: props.visivelTipo }}>Tipo Evento</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                            <th style={{ display: props.visivelD }}>Descriçao</th>
                        </tr>
                    </thead>
                    {props.lista && props.lista.length > 0 ? (
                        props.lista.map((item) => (
                            <tbody>
                                <tr className="item_lista" key={props.tipoLista == "tiposEventos" ? item.idTipoEvento : "tiposUsuarios" ? item.idTipoUsuario : item.idEvento}>
                                    <td data-cell="Nome" >
                                        {props.tipoLista == "tiposEventos" ? item.tituloTipoEvento : (props.tipoLista == "tiposUsuarios" ? item.tituloTipoUsuario : item.nomeEvento)}
                                    </td>

                                    <td data-cell="Data" style={{ display: props.visivelDt }}>
                                        {item.dataEvento
                                            ? format(new Date(item.dataEvento), 'dd/MM/yyyy')
                                            : 'Sem data'}
                                    </td>

                                    <td data-cell="Evento" style={{ display: props.visivelEV }}>{props.nomeEvento}{item.tiposEvento?.tituloTipoEvento}</td>

                                    <td data-cell="Editar" className="right">
                                        <img
                                            src={editar}
                                            alt="Imagem de uma caneta"
                                            onClick={() => props.funcEditar(item)}
                                            style={{ cursor: "pointer" }} />
                                    </td>

                                    <td data-cell="Excluir">
                                        <img
                                            src={excluir}
                                            alt="lixeira"
                                            onClick={() => (props.funcExcluir(item))}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </td>

                                    <td style={{ display: props.visivelD }} data-cell="Descrição" className="descricao">
                                        <img src={Detalhes} alt="Detalhes" onClick={() => { props.funcDescricao(item) }} style={{ cursor: "pointer" }} />
                                    </td>

                                </tr>
                            </tbody>
                        ))
                    ) :
                        (
                            <p className="saguiv2">Nenhum Tipo de Evento Encontrado.</p>
                        )
                    }
                </table>
            </div>
        </section>

    )

}


export default Listagem;