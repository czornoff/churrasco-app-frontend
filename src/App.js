import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import BadgeLimite from './components/BadgeLimite';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import { obterEstilos } from './components/Styles';

import Admin from './pages/admin/Admin';
import AdminConteudo from './pages/admin/AdminConteudo';
import AdminItem from './pages/admin/AdminItem';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminUsuario from './pages/admin/AdminUsuario';
import AdminIP from './pages/admin/AdminIP';

import Inicial from './pages/Inicial';
import Calculadora from './pages/Calculadora';
import Dicas from './pages/Dicas';
import OndeComprar from './pages/OndeComprar';
import Produtos from './pages/Produtos';
import Receitas from './pages/Receitas';
import Relatorio from './pages/Relatorio';
import Sobre from './pages/Sobre';
import Utensilios from './pages/Utensilios';

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
    const avisoStyle = { width: '100%', backgroundColor: '#fff3cd', color: '#856404', padding: '10px 0', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #ffeeba', marginTop: '5px', alignItems: 'center', justifyContent: 'center', gap: '8px', display: 'flex' };

    const [opcoes, setOpcoes] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [conteudo, setConteudo] = useState(null);
    const [atualizador, setAtualizador] = useState(0);
    const [showModalComplemento, setShowModalComplemento] = useState(false);
    const [complementoData, setComplementoData] = useState({
        nome: '', email: '', UF: '', Cidade: '', birthday: '', whatsApp: '', genero: ''
    });
    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);
    const { styles, adminStyles, headerStyles, footerStyles, modalStyles, loginStyles } = obterEstilos(conteudo);

    const perfilIncompleto = (u) => {
        if (!u) 
            return false;
        return !u.UF || !u.Cidade || !u.birthday || !u.whatsApp || !u.genero;
    };

    const abrirEdicao = useCallback((usuarioManual = null) => {
        const u = usuarioManual || usuario;

        if (u) {
            setComplementoData({
                nome: u.nome || '',
                email: u.email || '',
                UF: u.UF || '',
                Cidade: u.Cidade || '',
                birthday: u.birthday ? u.birthday.split('T')[0] : '',
                whatsApp: u.whatsApp || '',
                genero: u.genero || ''
            });
            setShowModalComplemento(true);
        } else {
        // Log para debug caso você clique e não aconteça nada
    }
    }, [usuario]);

    const aplicarMascaraWhatsapp = (value) => {
        if (!value) return "";
        
        // Remove tudo que não é dígito
        let v = value.replace(/\D/g, "");
        
        // Limita a 11 números (2 do DDD + 9 do número)
        v = v.slice(0, 11);

        // Aplica a máscara de DDD: (00)
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");

        // Aplica o hífen dinâmico
        // Se tem 11 dígitos (celular), o hífen vai após o 5º número (ex: 99999-9999)
        // Se tem até 10 dígitos (fixo), o hífen vai após o 4º número (ex: 8888-8888)
        if (v.length > 13) { 
            // Formato Celular: (00) 90000-0000 (total 15 caracteres com máscara)
            v = v.replace(/(\d{5})(\d)/, "$1-$2");
        } else {
            // Formato Fixo: (00) 0000-0000 (total 14 caracteres com máscara)
            v = v.replace(/(\d{4})(\d)/, "$1-$2");
        }

        return v;
    };

    const [exibirDicaIOS, setExibirDicaIOS] = useState(false);

    useEffect(() => {
        // Verifica se é iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        // Verifica se já não está instalado (modo standalone)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && !isStandalone) {
            setExibirDicaIOS(true);
        }
    }, []);

    useEffect(() => {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => res.json())
            .then(data => setUfs(data));
    }, []); 

    useEffect(() => {
        if (complementoData.UF) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${complementoData.UF}/municipios?orderBy=nome`)
                .then(res => res.json())
                .then(data => setCidades(data));
        } else {
            setCidades([]);
        }
    }, [complementoData.UF]);

    useEffect(() => {
        const carregarTudo = async () => {
            try {
                const [resOpcoes, resConteudo, resUser] = await Promise.all([
                    fetch(`${API_URL}/api/opcao`),
                    fetch(`${API_URL}/api/conteudo`, { cache: 'no-store' }),
                    fetch(`${API_URL}/auth/usuario`, { credentials: 'include' })
                ]);

                if (resOpcoes.ok) setOpcoes(await resOpcoes.json());
                if (resConteudo.ok) setConteudo(await resConteudo.json());
                
                if (resUser.ok) {
                    const dataUser = await resUser.json();
                    setUsuario(dataUser);
                    if (perfilIncompleto(dataUser)) {
                        abrirEdicao(dataUser);
                    }
                }
            } catch (err) {
                console.error("Erro na inicialização:", err);
            } finally {
                setCarregando(false);
            }
        };

        carregarTudo();
    }, [atualizador]);

    const salvarDadosPerfil = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin/usuario/atualizar/${usuario._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complementoData),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setShowModalComplemento(false);
                setUsuario(data.data); // Atualiza o usuário local com os dados do banco
                window.location.href = '/calculodechurrasco'; // Redireciona para limpar o estado e fechar o modal
            } else {
                alert("Erro ao salvar: " + (data.message || "Verifique todos os campos."));
            }
        } catch (err) {
            console.error("Erro ao salvar perfil:", err);
            alert("Erro de conexão com o servidor.");
        }
    };

    if (carregando || !opcoes || !conteudo) {
        return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f8f9fa',
            fontFamily: 'sans-serif'
        }}>
            {/* Ícone ou Logo Animado */}
            <div style={{
                fontSize: '50px',
                marginBottom: '20px',
                animation: 'pulse 1.5s infinite ease-in-out'
            }}>
                🔥
            </div>

            {/* Texto de Carregamento */}
            <h2 style={{ 
                color: '#d9534f', 
                marginBottom: '10px',
                fontWeight: 'bold' 
            }}>
                Preparando a brasa...
            </h2>
            
            <p style={{ color: '#666', fontSize: '14px' }}>
                Carregando a Calculadora de Churrasco
            </p>

            {/* CSS inline para a animação de pulso */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
    }

    return (
        <Router basename="/calculodechurrasco">
            <Header dados={conteudo} usuario={usuario} styles={styles} headerStyles={headerStyles} abrirPerfil = {() => abrirEdicao()}/> 
                <BadgeLimite usuario={usuario} API_URL={API_URL} limite={conteudo.limiteConsulta}/> 

            {window.location.hostname !== 'localhost' && <AdBanner slot="2870360789" />}
            
            <div style={{ minHeight: '80vh' }}>
                <Routes>
                    <Route path="/" element={<Inicial dados={conteudo} styles={styles} />} />
                    <Route path="/calculadora" element={<Calculadora dados={conteudo} opcoes={opcoes} styles={styles} modalStyles={modalStyles} usuario={usuario} />} />
                    <Route path="/dicas" element={<Dicas dados={conteudo?.dicas} styles={styles} />} />
                    <Route path="/onde-comprar" element={<OndeComprar conteudo={conteudo} styles={styles} />} />
                    <Route path="/produtos" element={<Produtos dados={conteudo?.produtos} styles={styles}  />} />
                    <Route path="/receitas" element={<Receitas dados={conteudo?.receitas} styles={styles} modalStyles={modalStyles}  />} />
                    <Route path="/relatorio/:id" element={<Relatorio styles={styles} adminStyles={adminStyles}  />} />
                    <Route path="/utensilios" element={<Utensilios dados={conteudo?.utensilios} styles={styles}  />} />
                    <Route path="/sobre" element={<Sobre dados={conteudo} styles={styles}  />} />

                    <Route path="/login" element={usuario && !perfilIncompleto(usuario) ? <Navigate to="/" /> : <Login styles={styles} loginStyles={loginStyles}/>} />
                    
                    <Route path="/admin" element={usuario?.role === 'admin' ? <Admin opcoes={opcoes} setOpcoes={setOpcoes} styles={styles} adminStyles={adminStyles} /> : <Navigate to="/login" />} />
                    <Route path="/admin/conteudo" element={usuario?.role === 'admin' ? <AdminConteudo conteudo={conteudo} setConteudo={setConteudo} atualizarApp={() => setAtualizador(prev => prev + 1)} styles={styles} adminStyles={adminStyles} /> : <Navigate to="/login" />} />
                    <Route path="/admin/item" element={usuario?.role === 'admin' ? <AdminItem opcoes={opcoes} setOpcoes={setOpcoes} styles={styles} adminStyles={adminStyles} /> : <Navigate to="/login" />} />
                    <Route path="/admin/relatorio" element={usuario?.role === 'admin' ? <AdminRelatorio styles={styles} adminStyles={adminStyles} /> : <Navigate to="/login" />} />
                    <Route path="/admin/usuarios" element={usuario?.role === 'admin' ? <AdminUsuario styles={styles} adminStyles={adminStyles} modalStyles={modalStyles} /> : <Navigate to="/" />} />
                    <Route path="/admin/ips" element={usuario?.role === 'admin' ? <AdminIP styles={styles} adminStyles={adminStyles} limite={conteudo.limiteConsulta} /> : <Navigate to="/login" />} 
/>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                
                {exibirDicaIOS && (
                    <div style={styles.bannerIOS}>
                        <p>Para instalar o App no seu iPhone:</p>
                        <p>Clique em <strong>Compartilhar</strong> 📤 e depois em <strong>Adicionar à Tela de Início</strong> ➕</p>
                        <button onClick={() => setExibirDicaIOS(false)}>Entendi</button>
                    </div>
                )}
            </div>


            {showModalComplemento && (
                
                <div 
                    style={modalStyles.overlay}
                    onClick={!perfilIncompleto(usuario) ? () => setShowModalComplemento(false) : undefined}
                
                >
                    <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                        { !perfilIncompleto(usuario) && ( 
                            <button style={modalStyles.closeBtn} onClick={() => setShowModalComplemento(false)}>✕</button>
                        )}  
                        <h2 style={ styles.modalHeader }>
                            {perfilIncompleto(usuario) ? "Complete seu Perfil 🔥" : "Meu Perfil"}
                        </h2>
                        <form onSubmit={salvarDadosPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input placeholder="Nome Completo" required style={loginStyles.input} 
                                value={complementoData.nome}
                                onChange={e => setComplementoData({ ...complementoData, nome: e.target.value })} />
                            <input placeholder="email" required 
                                {...usuario.googleId ? { readOnly: true } : {}}
                                style={loginStyles.input} 
                                value={complementoData.email}
                                onChange={e => setComplementoData({ ...complementoData, email: e.target.value })} />
                                { usuario?.googleId ?  (
                                    <div style={avisoStyle}>
                                        <span>⚠️</span>
                                        <span>Não é possível alterar email de login associado a Conta do Google</span>
                                    </div>
                                    ) : null }
                            <div style={ styles.colorInputGroup }>
                                {/* SELECT DE ESTADOS */}
                                <select 
                                    required 
                                    style={{ ...loginStyles.input, width: '80px' }} 
                                    value={complementoData.UF}
                                    onChange={e => setComplementoData({ ...complementoData, UF: e.target.value, Cidade: '' })} // Limpa a cidade ao trocar UF
                                >
                                    <option value="">UF</option>
                                    {ufs.map(uf => (
                                        <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                    ))}
                                </select>

                                {/* SELECT DE CIDADES */}
                                <select 
                                    required 
                                    style={{ ...loginStyles.input, flex: 1 }} 
                                    value={complementoData.Cidade}
                                    disabled={!complementoData.UF} // Desabilita se não tiver UF
                                    onChange={e => setComplementoData({ ...complementoData, Cidade: e.target.value })}
                                >
                                    <option value="">{complementoData.UF ? "Selecione a Cidade" : "Escolha a UF primeiro"}</option>
                                    {cidades.map(cidade => (
                                        <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <input type="date" required style={loginStyles.input} 
                                value={complementoData.birthday}
                                onChange={e => setComplementoData({ ...complementoData, birthday: e.target.value })} />
                            <input placeholder="WhatsApp (com DDD)" required style={loginStyles.input} 
                                value={complementoData.whatsApp}
                                maxLength={15} // Limita caracteres no campo
                                onChange={e => {
                                    const valorFormatado = aplicarMascaraWhatsapp(e.target.value);
                                    setComplementoData({ ...complementoData, whatsApp: valorFormatado });
                                }}
                            />
                            <select required style={loginStyles.input} 
                                onChange={e => setComplementoData({ ...complementoData, genero: e.target.value })}
                                value={complementoData.genero}>
                                <option value="">Gênero</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="outros">Outros</option>
                                <option value="undefined">Não Informar</option>
                            </select>
                            <button type="submit" style={{ ...loginStyles.submitBtn, width: '100%' }}>Salvar e Continuar</button>
                        </form>
                    </div>
                </div>
            )}

            {window.location.hostname !== 'localhost' && <AdBanner slot="6694055728" />}

            <Footer dados={conteudo} footerStyles={footerStyles}/>
        </Router>
    );
}