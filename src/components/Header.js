import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Header({ dados, usuario, abrirPerfil }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
    const navigate = useNavigate();

    // Configuração dos itens de menu para evitar repetição
    const menuItems = useMemo(() => [
        { label: 'Início', path: '/' },
        { label: 'Calculadora', path: '/calculadora' },
        { label: 'Dicas', path: '/dicas', protected: true },
        { label: 'Produtos', path: '/produtos', protected: true },
        { label: 'Receitas', path: '/receitas', protected: true },
        { label: 'Utensílios', path: '/utensilios', protected: true },
        { label: 'Onde Comprar', path: '/onde-comprar', protected: true },
        { label: 'Sobre', path: '/sobre' },
    ], []);

    // Lógica de Tema (Dark Mode)
    useEffect(() => {
        const root = window.document.documentElement;
        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            root.classList.toggle('dark', isDark);
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', applyTheme);
            return () => mediaQuery.removeEventListener('change', applyTheme);
        }
    }, [theme]);

    // Listener de Resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setMenuAberto(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        const themes = ['system', 'light', 'dark'];
        setTheme(prev => themes[(themes.indexOf(prev) + 1) % themes.length]);
    };

    const navegarComVerificacao = async (e, destino) => {
        e.preventDefault();
        setMenuAberto(false);
        if (usuario) return navigate(destino);

        try {
            const res = await fetch(`${API_URL}/api/verificar-acesso`, { method: 'POST', credentials: 'include' });
            const data = await res.json();
            if (res.status === 403 && data.limiteAtingido) {
                alert(`🔥 Limite atingido! Visitantes podem ver apenas ${dados.limiteConsulta} conteúdos. Faça login!`);
                navigate('/login', { state: { mensagem: "Atingiu o limite" } });
            } else navigate(destino);
        } catch { navigate(destino); }
    };

    return (
        <header className="bg-neutral-900 text-white shadow-xl sticky top-0 z-[1000] font-sans dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-5 h-[85px]">
                
                {/* Logo Section */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setMenuAberto(false)}>
                        <img 
                            src={dados.logoUrl ? `${API_URL}${dados.logoUrl}` : '/logos/logo.png'}
                            alt={dados.nomeApp} 
                            className="h-[60px] md:h-[70px] w-auto block" 
                        />
                    </Link>

                    {!isMobile && (
                        <nav className="flex gap-4">
                            {menuItems.map(item => (
                                <Link 
                                    key={item.path}
                                    to={item.path} 
                                    onClick={item.protected ? (e) => navegarComVerificacao(e, item.path) : undefined}
                                    className="text-neutral-300 no-underline text-xs font-bold uppercase tracking-wider hover:text-primary-400 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:border-primary-400 transition-all">
                        {theme === 'system' ? '☾☀︎' : theme === 'light' ? '☀️' : '🌙'}
                    </button>

                    {!isMobile && (
                        usuario ? (
                            <div className="relative" onMouseEnter={() => setDropdownAberto(true)} onMouseLeave={() => setDropdownAberto(false)}>
                                <button className="bg-neutral-800 p-2 pr-4 flex items-center gap-3 rounded-lg border border-neutral-700 shadow-xl text-white">
                                    <img src={usuario.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-primary-400 object-cover" />
                                    <span className="text-sm font-bold uppercase tracking-tighter">{usuario.nome.split(' ')[0]} ▼</span>
                                </button>
                                {dropdownAberto && (
                                    <div className="absolute top-full right-0 bg-neutral-900 min-w-[200px] shadow-2xl rounded-xl p-2 border border-neutral-700 z-[1100] animate-in fade-in slide-in-from-top-1">
                                        {usuario.role === 'admin' && (
                                            <>
                                                <p className="px-3 py-2 text-sm font-black uppercase text-primary-700">Administração</p>
                                                <Link to="/admin" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">🛠️ Painel Geral</Link>
                                                <Link to="/admin/conteudo" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">📝 Conteúdo</Link>
                                                <Link to="/admin/item" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">⚙️ Itens</Link>
                                                <Link to="/admin/relatorio" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">📊 Relatórios</Link>
                                                <Link to="/admin/usuarios" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">👥 Usuários</Link>
                                                <Link to="/admin/ips" className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">💻 Bloqueio IPs</Link>
                                            </>
                                        )}
                                        {usuario.role !== 'admin' && (
                                            <>
                                                <Link to={`/relatorio/${usuario._id}`} className="block p-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 rounded-lg">📊 Relatórios</Link>
                                            </>
                                        )}
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => {abrirPerfil(); setMenuAberto(false)}} className="w-full p-4 rounded-xl bg-neutral-800 font-bold uppercase text-xs">👤 Editar Perfil</button>
                                            <button onClick={() => window.location.href = `${API_URL}/auth/logout`} className="w-full p-4 rounded-xl bg-red-600 font-bold uppercase text-xs shadow-lg shadow-red-600/20">Sair da Conta</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary-700 hover:bg-primary-400 px-6 py-2.5 rounded-lg font-black uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500">Entrar</Link>
                        )
                    )}

                    {isMobile && (
                        <button onClick={() => setMenuAberto(!menuAberto)} className="text-3xl p-2 z-[1101]">
                            {menuAberto ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* MOBILE DRAWER (Ocupando 80% da direita) */}
            {isMobile && menuAberto && (
                <div className="fixed inset-0 z-[1100]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuAberto(false)} />
                    
                    <div className="absolute right-0 top-0 h-full w-[80%] bg-neutral-900 dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-neutral-800 animate-in slide-in-from-right duration-300">
                        
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
                            {usuario ? (
                                <div className="flex items-center gap-4">
                                    <img src={usuario.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary-700" />
                                    <div>
                                        <p className="font-black uppercase tracking-tighter text-md leading-tight">{usuario?.nome}</p>
                                        <p className="text-xs text-primary-700 font-bold uppercase tracking-widest">{usuario?.role}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="font-black uppercase tracking-widest text-neutral-500">Navegação</p>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <nav className="flex flex-col gap-1">
                                {menuItems.map(item => (
                                    <Link 
                                        key={item.path}
                                        to={item.path}
                                        onClick={item.protected ? (e) => navegarComVerificacao(e, item.path) : () => setMenuAberto(false)}
                                        className="p-2 rounded-xl text-sm font-black uppercase tracking-tight hover:bg-neutral-800 active:bg-neutral-700 transition-colors border-b border-neutral-800/50"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {usuario?.role !== 'admin' && usuario?._id && (
                                    <>
                                        <Link to={`/relatorio/${usuario._id}`} className="block p-3 text-xs font-bold uppercase" onClick={ () => setMenuAberto(false)}>📊 Relatórios</Link>
                                    </>
                                )}

                                {usuario?.role === 'admin' && (
                                    <div className="mt-4 p-2 bg-neutral-600/10 rounded-2xl border border-neutral-600/20">
                                        <p className="px-3 py-2 text-sm font-black uppercase text-primary-700">Administração</p>
                                        <Link to="/admin" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>🛠️ Painel Geral</Link>
                                        <Link to="/admin/conteudo" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>📝 Conteúdo</Link>
                                        <Link to="/admin/item" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>⚙️ Itens</Link>
                                        <Link to="/admin/relatorio" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>📊 Relatórios</Link>
                                        <Link to="/admin/usuarios" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>👥 Usuários</Link>
                                        <Link to="/admin/ips" className="block p-3 text-xs font-bold uppercase" onClick={() => setMenuAberto(false)}>💻 Bloqueio IPs</Link>
                                    </div>
                                )}
                                
                            </nav>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-neutral-800 bg-black/20">
                            {usuario ? (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => {abrirPerfil(); setMenuAberto(false)}} className="w-full p-4 rounded-xl bg-neutral-800 font-bold uppercase text-xs">👤 Editar Perfil</button>
                                    <button onClick={() => window.location.href = `${API_URL}/auth/logout`} className="w-full p-4 rounded-xl bg-red-600 font-bold uppercase text-xs shadow-lg shadow-red-600/20">Sair da Conta</button>
                                </div>
                            ) : (
                                <Link to="/login" className="block w-full p-4 rounded-xl bg-orange-600 text-center font-black uppercase text-sm shadow-lg shadow-orange-600/30" onClick={() => setMenuAberto(false)}>Entrar</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}