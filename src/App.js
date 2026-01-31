import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import BadgeLimite from './components/BadgeLimite';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';

import Admin from './pages/admin/Admin';
import AdminConteudo from './pages/admin/AdminConteudo';
import AdminItem from './pages/admin/AdminItem';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminUsuario from './pages/admin/AdminUsuario';
import AdminIP from './pages/admin/AdminIP';

import PaginaTexto from './pages/PaginaTexto';
import Calculadora from './pages/Calculadora';
import Items from './pages/Items';
import OndeComprar from './pages/OndeComprar';
import Receitas from './pages/Receitas';
import Relatorio from './pages/Relatorio';

const API_URL = process.env.REACT_APP_API_URL;

// Componente para rolar ao topo automaticamente em cada troca de rota
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
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

    const corPrimary = conteudo?.primary || '#ea580c';

    const perfilIncompleto = (u) => {
        if (!u) return false;
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
        }
    }, []);

    const aplicarMascaraWhatsapp = (value) => {
        if (!value) return "";
        let v = value.replace(/\D/g, "");
        v = v.slice(0, 11);
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        if (v.length > 13) { 
            v = v.replace(/(\d{5})(\d)/, "$1-$2");
        } else {
            v = v.replace(/(\d{4})(\d)/, "$1-$2");
        }
        return v;
    };

    const [exibirDicaIOS, setExibirDicaIOS] = useState(false);

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isIOS && !isStandalone) setExibirDicaIOS(true);
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
                    if (perfilIncompleto(dataUser)) abrirEdicao(dataUser);
                }
            } catch (err) {
                console.error("Erro na inicialização:", err);
            } finally {
                setCarregando(false);
            }
        };
        carregarTudo();
    }, [atualizador, abrirEdicao]);

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
                setUsuario(data.data);
                window.location.href = '/calculodechurrasco';
            } else {
                alert("Erro ao salvar: " + (data.message || "Verifique os campos."));
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    };

    if (carregando || !opcoes || !conteudo) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-neutral-50 dark:bg-zinc-950 transition-colors">
                <div className="text-6xl mb-6 animate-bounce">🔥</div>
                <h2 className="text-2xl font-black text-primary-700 dark:text-primary-400 mb-2 uppercase">
                    Preparando a brasa...
                </h2>
                <p className="text-neutral-500 dark:text-zinc-400 font-medium animate-pulse">
                    Carregando Relatórios de Inteligência
                </p>
            </div>
        );
    }

    return (
        <Router basename="/calculodechurrasco">
            <ScrollToTop />
            
            <style>{`
                :root {
                    --cor-primary: ${corPrimary};
                    --cor-primary-hover: ${corPrimary}cc; /* 80% opacidade */
                }
                .bg-primary-700, .bg-primary-400 { background-color: var(--cor-primary) !important; }
                .border-primary-700, .border-primary-400 { border-color: var(--cor-primary) !important; }
                .focus\\:ring-primary-400:focus { --tw-ring-color: var(--cor-primary) !important; }
                .text-primary-700, .text-primary-400 { color: var(--cor-primary) !important; }
                .shadow-primary-500\\/20 { --tw-shadow-color: var(--cor-primary) !important; }
                .hover\\:bg-primary-400:hover { background-color: var(--cor-primary-hover) !important; }
                .hover\\:border-primary-400:hover { border-color: var(--cor-primary-hover) !important; }
                .hover\\:text-primary-400:hover { color: var(--cor-primary-hover) !important; }
            `}</style>

            <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 transition-colors duration-300 rounded-xl">
                <Header dados={conteudo} usuario={usuario} abrirPerfil={() => abrirEdicao()}/> 
                
                <main className="flex-grow">
                    <BadgeLimite usuario={usuario} API_URL={API_URL} limite={conteudo.limiteConsulta}/> 
                    
                    {window.location.hostname !== 'localhost' && (
                        <div className="max-w-7xl mx-auto py-4 px-4 overflow-hidden">
                            <AdBanner slot="2870360789" />
                        </div>
                    )}
                    
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <Routes>
                            <Route path="/" element={<PaginaTexto titulo={conteudo?.inicioTitulo} texto={conteudo?.inicioTexto} />} />
                            <Route path="/calculadora" element={<Calculadora dados={conteudo} opcoes={opcoes} usuario={usuario} />} />
                            <Route path="/dicas" element={<Items dados={conteudo?.dicas} />} />
                            <Route path="/onde-comprar" element={<OndeComprar conteudo={conteudo} />} />
                            <Route path="/produtos" element={<Items dados={conteudo?.produtos} />} />
                            <Route path="/receitas" element={<Receitas dados={conteudo?.receitas} />} />
                            <Route path="/relatorio/:id" element={<Relatorio />} />
                            <Route path="/utensilios" element={<Items dados={conteudo?.utensilios} />} />
                            <Route path="/sobre" element={<PaginaTexto titulo={conteudo?.sobreTitulo} texto={conteudo?.sobreTexto} />} />
                            <Route path="/login" element={usuario && !perfilIncompleto(usuario) ? <Navigate to="/" /> : <Login />} />
                            
                            {/* Rotas Admin */}
                            <Route path="/admin" element={usuario?.role === 'admin' ? <Admin opcoes={opcoes} setOpcoes={setOpcoes} /> : <Navigate to="/login" />} />
                            <Route path="/admin/conteudo" element={usuario?.role === 'admin' ? <AdminConteudo conteudo={conteudo} setConteudo={setConteudo} atualizarApp={() => setAtualizador(prev => prev + 1)} /> : <Navigate to="/login" />} />
                            <Route path="/admin/item" element={usuario?.role === 'admin' ? <AdminItem opcoes={opcoes} setOpcoes={setOpcoes} /> : <Navigate to="/login" />} />
                            <Route path="/admin/relatorio" element={usuario?.role === 'admin' ? <AdminRelatorio /> : <Navigate to="/login" />} />
                            <Route path="/admin/usuarios" element={usuario?.role === 'admin' ? <AdminUsuario /> : <Navigate to="/" />} />
                            <Route path="/admin/ips" element={usuario?.role === 'admin' ? <AdminIP limite={conteudo.limiteConsulta} /> : <Navigate to="/login" />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>

                    {exibirDicaIOS && (
                        <div className="fixed bottom-20 left-4 right-4 z-[60] bg-white dark:bg-zinc-900 border-t-4 border-primary-400 shadow-xl p-6 rounded-xl animate-in slide-in-from-bottom duration-500">
                            <h4 className="font-black text-neutral-900 dark:text-white uppercase mb-2">📲 Instale o App</h4>
                            <p className="text-sm mb-4">No seu iPhone: toque em <strong>Compartilhar</strong> 📤 e depois em <strong>Adicionar à Tela de Início</strong> ➕</p>
                            <button onClick={() => setExibirDicaIOS(false)} className="w-full bg-primary-700 text-white font-black py-3 rounded-xl uppercase tracking-tighter">Entendi</button>
                        </div>
                    )}
                </main>

                {showModalComplemento && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={!perfilIncompleto(usuario) ? () => setShowModalComplemento(false) : undefined}>
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">
                                        {perfilIncompleto(usuario) ? "Complete seu Perfil 🔥" : "👤 Perfil"}
                                    </h2>
                                    {!perfilIncompleto(usuario) && (
                                        <button onClick={() => setShowModalComplemento(false)} className="text-neutral-400 hover:text-red-500 transition-colors">✕</button>
                                    )}
                                </div>

                                <form onSubmit={salvarDadosPerfil} className="flex flex-col gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Nome Completo</label>
                                        <input required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold focus:ring-2 focus:ring-primary-400 transition-all"
                                            value={complementoData.nome} onChange={e => setComplementoData({ ...complementoData, nome: e.target.value })} />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">E-mail</label>
                                        <input required readOnly={!!usuario.googleId} className={`w-full px-4 py-3 rounded-xl border-none font-bold ${usuario.googleId ? 'bg-neutral-200 dark:bg-zinc-700 opacity-60 cursor-not-allowed' : 'bg-neutral-100 dark:bg-zinc-800 focus:ring-2 focus:ring-primary-400'}`}
                                            value={complementoData.email} onChange={e => setComplementoData({ ...complementoData, email: e.target.value })} />
                                        {usuario?.googleId && (
                                            <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-bold">
                                                <span>⚠️</span> Vinculado à Conta Google
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-24 space-y-1">
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">UF</label>
                                            <select required className="w-full px-3 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold"
                                                value={complementoData.UF} onChange={e => setComplementoData({ ...complementoData, UF: e.target.value, Cidade: '' })}>
                                                <option value="">--</option>
                                                {ufs.map(uf => <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Cidade</label>
                                            <select required disabled={!complementoData.UF} className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold disabled:opacity-40"
                                                value={complementoData.Cidade} onChange={e => setComplementoData({ ...complementoData, Cidade: e.target.value })}>
                                                <option value="">{complementoData.UF ? "Selecione..." : "Escolha a UF"}</option>
                                                {cidades.map(cidade => <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Nascimento</label>
                                            <input type="date" required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold"
                                                value={complementoData.birthday} onChange={e => setComplementoData({ ...complementoData, birthday: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">WhatsApp</label>
                                            <input required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold"
                                                value={complementoData.whatsApp} maxLength={15} onChange={e => setComplementoData({ ...complementoData, whatsApp: aplicarMascaraWhatsapp(e.target.value) })} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Gênero</label>
                                        <select required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold"
                                            value={complementoData.genero} onChange={e => setComplementoData({ ...complementoData, genero: e.target.value })}>
                                            <option value="">Selecione...</option>
                                            <option value="masculino">Masculino</option>
                                            <option value="feminino">Feminino</option>
                                            <option value="outros">Outros</option>
                                            <option value="undefined">Não Informar</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="mt-4  py-4 rounded-xl uppercase tracking-tighter shadow-xl transition-all bg-primary-700 hover:bg-primary-400 text-white text-lg font-black hover:scale-110 active:scale-95 text-center ">
                                        Salvar e Continuar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {window.location.hostname !== 'localhost' && (
                    <div className="max-w-7xl mx-auto py-6 px-4">
                        <AdBanner slot="6694055728" />
                    </div>
                )}

                <Footer dados={conteudo} />
            </div>
        </Router>
    );
}