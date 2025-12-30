import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculadora from './pages/Calculadora';
import AdminPanel from './pages/Admin';
import Login from './components/Login';
import Header from './components/Header';


const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
  const [opcoes, setOpcoes] = useState(null);
  const [usuario, setUsuario] = useState(null); // Agora guardamos o objeto do usuário
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Carrega as opções da calculadora
        fetch(`${API_URL}/opcoes`)
            .then(res => res.json())
            .then(data => setOpcoes(data))
            .catch(err => console.error("Erro ao carregar opções:", err));

    // 2. Verifica se existe um usuário logado na sessão (Passport)
    // Importante: Adicionar { credentials: true } se o back estiver em domínio diferente
        fetch(`${API_URL}/auth/usuario`, { credentials: 'include' }) // ADICIONE ISSO
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Não autenticado");
            })
            .then(data => setUsuario(data))
            .catch(() => setUsuario(null))
            .finally(() => setCarregando(false));
    }, []);

    if (carregando || !opcoes) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando dados...</div>;
    }

  return (
    <Router>
    {/* O Header fica fora do Routes para aparecer em tudo */}
    <Header usuario={usuario} /> 
    
    <div style={{ marginTop: '20px' }}> {/* Espaçamento para o conteúdo não grudar no header */}
        <Routes>
            <Route path="/" element={<Calculadora opcoes={opcoes} />} />
            <Route path="/login" element={usuario ? <Navigate to="/" /> : <Login />} />
            <Route 
            path="/admin" 
            element={
                usuario?.role === 'admin' ? (
                <AdminPanel opcoes={opcoes} setOpcoes={setOpcoes} />
                ) : (
                <Navigate to="/login" />
                )
            } 
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </div>
    </Router>
    );
}