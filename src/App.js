import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';

import Admin from './pages/admin/Admin';
import AdminConteudo from './pages/admin/AdminConteudo';
import AdminItem from './pages/admin/AdminItem';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminUsuario from './pages/admin/AdminUsuario';
import Calculadora from './pages/Calculadora';
import Dicas from './pages/Dicas';
import Produtos from './pages/Produtos';
import Receitas from './pages/Receitas';
import Sobre from './pages/Sobre';
import Utensilios from './pages/Utensilios';

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
    const [opcoes, setOpcoes] = useState(null);
    const [relatorios, setRelatorios] = useState(null);
    const [usuario, setUsuario] = useState(null); // Agora guardamos o objeto do usuário
    const [carregando, setCarregando] = useState(true);
    const [conteudo, setConteudo] = useState(null);
    const [atualizador, setAtualizador] = useState(0);
    
    useEffect(() => {
        // 1. Carrega as opções da calculadora
            fetch(`${API_URL}/api/opcao`)
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

            // Carrega o conteúdo das páginas
            fetch(`${API_URL}/api/conteudo?v=${new Date().getTime()}`, {
                cache: 'no-store'
            })
                .then(res => res.json())
                .then(data => {setConteudo(data);setCarregando(false);})
                .catch(err => console.error("Erro ao carregar conteúdo:", err));
        }, [atualizador]);

        if (carregando || !opcoes || !conteudo) {
            return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando dados...</div>;
        }

        return (
            <Router>
            {/* O Header fica fora do Routes para aparecer em tudo */}
            <Header usuario={usuario} /> 
            
                <div style={{ marginTop: '0px', minHeight: '80vh' }}> {/* Espaçamento para o conteúdo não grudar no header */}
                    <Routes>
                        <Route path="/" element={<Calculadora opcoes={opcoes} />} />
                        <Route path="/dicas" element={<Dicas dados={conteudo?.dicas} />} />
                        <Route path="/produtos" element={<Produtos dados={conteudo?.produtos}  />} />
                        <Route path="/receitas" element={<Receitas dados={conteudo?.receitas}  />} />
                        <Route path="/utensilios" element={<Utensilios dados={conteudo?.utensilios}  />} />
                        <Route path="/sobre" element={<Sobre dados={conteudo}  />} />

                        {/* Autenticação e Admin */}
                        <Route path="/login" element={usuario ? <Navigate to="/" /> : <Login />} />
                        <Route path="/admin" 
                            element={
                                usuario?.role === 'admin' ? (
                                    <Admin opcoes={opcoes} setOpcoes={setOpcoes} />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            } 
                        />
                        <Route path="/admin/item" 
                            element={
                                usuario?.role === 'admin' ? (
                                    <AdminItem opcoes={opcoes} setOpcoes={setOpcoes} />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            } 
                        />
                        <Route path="/admin/conteudo" 
                            element={
                                usuario?.role === 'admin' ? (
                                    <AdminConteudo 
                                        conteudo={conteudo} 
                                        setConteudo={setConteudo} 
                                        atualizarApp={() => setAtualizador(prev => prev + 1)} // Passe isso
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            } 
                        />
                        <Route path="/admin/relatorio" 
                            element={
                                usuario?.role === 'admin' ? (
                                    <AdminRelatorio />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            } 
                        />
                        <Route path="/admin/usuarios" 
                            element={
                                usuario?.role === 'admin' ? (
                                    <AdminUsuario />
                                ) : (
                                    <Navigate to="/" />
                                )
                            } 
                        />

                        {/* Fallback para home */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>

            <Footer />
        </Router>
    );
}