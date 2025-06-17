//Importa funcoes do react necessarias para criar e usar o contexto
import { createContext, useState, useContext, Children } from "react";

import secureLocalStorage from 'react-secure-storage'

//cria o contexto de autenticacao que vai permitir compartilhar dados entre componentes 
const AuthContext = createContext();

//Esse componente vai envolver a aplicacao ouu parte dela e fornecer os dados de autenticacao
//para os filhos provider = prover/dar
export const AuthProvider = ({ children }) => {
    //Cria um estado que guarda os dados do usuario logado
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = secureLocalStorage.getItem("tokenLogin");
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : undefined;
    });


    return (
        //O authContext.Provider permite que qualquer componente dentro dele acesse o usuario e setUsuario
        //faz com que qualquer componente que esteja dentro de <AuthProvider> consiga acessar
        // o valor {usuario, setUsuario} usando hook useAuth()
        <AuthContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );

};

//Esse hook personalizado facilita o acesso ao contexto dentro de qualquer componente
// USAR
export const useAuth = () => useContext(AuthContext)

