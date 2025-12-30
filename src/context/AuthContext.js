import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica se o usuário está logado ao carregar a página
        fetch(`${process.env.REACT_APP_API_URL}/auth/usuario`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Não logado');
            })
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/logout`;
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);