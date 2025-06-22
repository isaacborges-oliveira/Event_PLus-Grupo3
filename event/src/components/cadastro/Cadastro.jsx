import "./Cadastro.css"
import Botao from "../botao/Botao";

const Cadastro = (props) => {
    return (
        <section className="layout_grid section_cadastro">
            <div className="cadastro_titulo">
                <h1>{props.titulo_cadastro}</h1>
                <hr />
            </div>

            <form onSubmit={props.funcCadastro} className="form_cadastro">
                <div className="img_cadastro">
                    <img src={props.banner_img} alt="Imagem do Cadastro" />
                </div>

                <div className="campos_cadastro">

                    {/* nome evento */}
                    <div className="campo_cad_nome">
                        <input
                            type="text"
                            placeholder={props.campo_placeholder}
                            value={props.valorInput}
                            onChange={(e) => props.setValorInput(e.target.value)}
                        />
                    </div>

                    {/* data evento */}
                    <div className="campo_cad_nome">
                        <input
                            style={{ display: props.visibilidade_data }}
                            type="date"
                            value={props.valorData}
                            onChange={(e) => props.setValorData(e.target.value)}
                        />
                    </div>

                    {/* tipo evento */}
                    <div className="campo_cad_eventos" style={{ display: props.visibilidade_tp_evento }}>
                        <select name="Tipo Evento"
                            value={props.valorTpEvento}
                            onChange={(e) => props.setValorTpEvento(e.target.value)}
                        >
                            <option disabled value="">Tipo Evento</option>
                            {props.lista &&
                                props.lista.length > 0 &&
                                props.lista.map((itemTpEvento) =>
                                    <option value={itemTpEvento.idTipoEvento}>{itemTpEvento.tituloTipoEvento}</option>
                                )}
                        </select>
                    </div>

                    {/* Instituição */}
                    <div className="campo_cad_eventos" style={{ display: props.visibilidade_instituicao }}>
                        <select name="Instituicao"
                            value={props.valorInstituicao}
                            onChange={(e) => props.setValorInstituicao(e.target.value)}
                        >
                            <option selected>Senai</option>
                        </select>
                    </div>

                    {/* Descrição evento */}
                    <div className="campo_cad_nome">
                        <input
                            type="text"
                            placeholder={props.campo_descricao}
                            value={props.valorInputDescricao}
                            style={{ display: props.visibilidade_descricao }}

                            onChange={(e) => props.setValorInputDescricao(e.target.value)}
                        />
                    </div>
                    <Botao botao={props.botao} />
                </div>
            </form>
        </section>
    )
}

export default Cadastro;