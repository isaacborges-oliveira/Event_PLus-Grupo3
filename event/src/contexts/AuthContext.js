// Importa funções do React necessárias para criar e usar o contexto
import { createContext, useState, useContext, children } from "react";
import secureLocalStorage from "react-secure-storage";

//Cria o contexto de autenticação, que vai permitr compartilhar dados entre componentes
const AuthContext = createContext();

// Esse componente vai envolver a aplicação (ou parte dela) e fornecer os dados de autenticação para os filhos
// Provider = prover/dar
export const AuthProvider = ({ children }) => {
    // Cria um estadisque guarda os dados do usuário logado
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = secureLocalStorage.getItem("tokenLogin");
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : undefined;
    });

    return (
        // O AuthContext.Provider permite que qualquer Componente dente dele acesse o `Usuario` e `setUsuario`

        // Faz com que qualquer compomente que esteja dentre de <AuthProvider> consiga acessar o valor { usuario, setUsuario} usando o hook useAuth().

        <AuthContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthRemove = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = secureLocalStorage.getItem("tokenLogin");
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : undefined;
    });

    return (
        // O AuthContext.Provider permite que qualquer Componente dente dele acesse o `Usuario` e `setUsuario`

        // Faz com que qualquer compomente que esteja dentre de <AuthProvider> consiga acessar o valor { usuario, setUsuario} usando o hook useAuth().

        <AuthContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}

export const removeAuth = ({})

// Esse hook personalizado facilita o acesso ao contexto dentr de qualquer componente

//USAR!!!
export const useAuth = () => useContext(AuthContext);