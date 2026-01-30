import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Header({ dados, usuario, abrirPerfil }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const navigate = useNavigate();

    // 1. Estado do tema: 'light', 'dark' ou 'system'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Função para aplicar o tema baseado na escolha ou no sistema
        const applyTheme = () => {
            let colorTheme = theme;
            
            if (theme === 'system') {
                colorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            if (colorTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        // Se estiver no modo 'system', precisamos ouvir mudanças do SO em tempo real
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuAberto(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Função para ciclar entre os temas: System -> Light -> Dark
    const toggleTheme = () => {
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    // Ícone dinâmico para o botão
    const getThemeIcon = () => {
        if (theme === 'system') return '☾☀︎'; // Ou ⚙️
        if (theme === 'light') return '☀️';
        return '🌙';
    };

    const navegarComVerificacao = async (e, destino) => {
        e.preventDefault();
        setMenuAberto(false);
        if (usuario) { navigate(destino); return; }
        try {
            const res = await fetch(`${API_URL}/api/verificar-acesso`, { 
                method: 'POST',
                credentials: 'include' 
            });
            const data = await res.json();
            if (res.status === 403 && data.limiteAtingido) {
                alert(`🔥 Limite atingido! Visitantes podem ver apenas ${dados.limiteConsulta} conteúdos/cálculos por dia. Faça login para continuar!`);
                navigate('/login', { state: { mensagem: "Atingiu o limite" } });
            } else { navigate(destino); }
        } catch (error) { navigate(destino); }
    };

    return (
        <header className="bg-neutral-900 text-white shadow-xl sticky top-0 z-[1000] font-sans dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-5 h-[85px]">
                
                <div className="flex items-center gap-8">
                    <Link to="/" className="no-underline flex items-center gap-2" onClick={() => setMenuAberto(false)}>
                        <img 
                            src={dados.logoUrl ? `${API_URL}${dados.logoUrl}` : '/logos/logo.png'}
                            alt={dados.nomeApp} 
                            className="h-[70px] w-auto block" 
                        />
                    </Link>

                    {!isMobile && (
                        <nav className="flex gap-5">
                            <Link to="/" className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Início</Link>
                            <Link to="/calculadora" className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Calculadora</Link>
                            <Link to="/dicas" onClick={(e) => navegarComVerificacao(e, "/dicas")} className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Dicas</Link>
                            <Link to="/produtos" onClick={(e) => navegarComVerificacao(e, "/produtos")} className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Produtos</Link>
                            <Link to="/receitas" onClick={(e) => navegarComVerificacao(e, "/receitas")} className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Receitas</Link>
                            <Link to="/utensilios" onClick={(e) => navegarComVerificacao(e, "/utensilios")} className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Utensílios</Link>
                            <Link to="/onde-comprar" onClick={(e) => navegarComVerificacao(e, "/onde-comprar")} className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Onde Comprar</Link>
                            <Link to="/sobre" className="text-neutral-300 no-underline text-sm font-medium uppercase tracking-wider hover:text-orange-400 transition-colors">Sobre</Link>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    {/* BOTÃO DE 3 ESTADOS */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-orange-400 transition-all dark:bg-zinc-800 dark:border-zinc-700"
                        title={`Tema atual: ${theme} (Clique para mudar)`}
                    >
                        <span className="text-lg leading-none">{getThemeIcon()}</span>
                    </button>

                    {usuario ? (
                        <div className="flex flex-row items-center gap-[15px]">
                            {!isMobile && (
                                <div className="relative inline-block" onMouseEnter={() => setDropdownAberto(true)} onMouseLeave={() => setDropdownAberto(false)}>
                                    <button className="bg-neutral-800 text-yellow-500 border-0 py-2 px-4 cursor-pointer font-bold text-sm flex items-center gap-[5px] rounded dark:bg-zinc-800 shadow-xl">
                                        <div className="flex items-center gap-[10px]">
                                            <img src={usuario.avatar} alt="Avatar" className="w-[38px] h-[38px] rounded-full border-2 border-orange-700 object-cover" />
                                            <span className="text-white text-sm font-semibold">{usuario.nome.split(' ')[0]} {usuario?.role === 'admin' ? '🛠️' : ''} ▼</span>
                                        </div>
                                    </button>
                                    {dropdownAberto && (
                                        <div className="absolute top-[90%] right-0 bg-neutral-800 min-w-[180px] shadow-xl rounded mt-1 p-1 border border-neutral-700 z-[1100] dark:bg-zinc-900">
                                            <Link className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors cursor-pointer" onClick={(e) => {e.stopPropagation(); abrirPerfil(); setDropdownAberto(false)}}>👤 Perfil</Link>
                                            {usuario?.role !== 'admin' && (
                                                <Link to={`/relatorio/${usuario._id}`} className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>📊 Relatório</Link>
                                            )}
                                            {usuario?.role === 'admin' && (
                                                <>
                                                    <div className="h-px bg-neutral-700 my-1" />
                                                    <Link to="/admin" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>🛠️ Painel</Link>
                                                    <Link to="/admin/conteudo" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>📝 Conteúdo</Link>
                                                    <Link to="/admin/item" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>⚙️ Itens</Link>
                                                    <Link to="/admin/relatorio" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>📊 Relatórios</Link>
                                                    <Link to="/admin/ips" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>💻 Bloqueio IPs</Link>
                                                    <Link to="/admin/usuarios" className="text-neutral-200 font-semibold py-2 px-4 no-underline block text-sm hover:bg-neutral-700 transition-colors" onClick={() => setDropdownAberto(false)}>👥 Usuários</Link>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {!isMobile && (
                                <button onClick={() => window.location.href = `${API_URL}/auth/logout`} className="bg-red-500 text-white border border-neutral-600 py-1.5 px-3 rounded cursor-pointer text-xs font-medium hover:bg-red-800 transition-colors">Sair</button>
                            )}
                        </div>
                    ) : (
                        !isMobile && <Link to="/login" className="bg-orange-700 text-white no-underline py-2 px-5 rounded font-bold hover:bg-orange-400 transition-colors hover:scale-110 active:scale-95">Entrar</Link>
                    )}

                    {isMobile && (
                        <button onClick={() => setMenuAberto(!menuAberto)} className="bg-none border-none text-white text-3xl cursor-pointer ml-1">
                            {menuAberto ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* MENU MOBILE */}
            {isMobile && menuAberto && (
                <div className="absolute top-[60px] left-0 w-full bg-neutral-800 flex flex-col p-5 gap-3 border-t border-neutral-700 shadow-xl z-[999] dark:bg-zinc-900 transition-colors">
                    <Link to="/" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={() => setMenuAberto(false)}>Início</Link>
                    <Link to="/calculadora" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={() => setMenuAberto(false)}>Calculadora</Link>
                    <Link to="/dicas" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={(e) => {setMenuAberto(false); navegarComVerificacao(e, "/dicas")}}>Dicas</Link>
                    <Link to="/produtos" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={(e) => {setMenuAberto(false); navegarComVerificacao(e, "/produtos")}}>Produtos</Link>
                    <Link to="/receitas" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={(e) => {setMenuAberto(false); navegarComVerificacao(e, "/receitas")}}>Receitas</Link>
                    <Link to="/utensilios" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={(e) => {setMenuAberto(false); navegarComVerificacao(e, "/utensilios")}}>Utensílios</Link>
                    <Link to="/onde-comprar" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={(e) => {setMenuAberto(false); navegarComVerificacao(e, "/onde-comprar")}}>Onde Comprar</Link>
                    <Link to="/sobre" className="text-neutral-200 no-underline text-base font-bold uppercase py-2 border-b border-neutral-700" onClick={() => setMenuAberto(false)}>Sobre</Link>
                    
                    {usuario ? (
                        <>
                            <Link to="#" className="text-neutral-200 no-underline text-base font-bold uppercase py-2" onClick={() => {abrirPerfil(); setMenuAberto(false)}}>👤 Perfil</Link>
                            <button onClick={() => window.location.href = `${API_URL}/auth/logout`} className="bg-orange-700 text-white border-none p-3 rounded font-bold mt-2 uppercase">Sair da Conta</button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-orange-700 text-white no-underline p-3 rounded font-bold mt-2 text-center uppercase" onClick={() => setMenuAberto(false)}>Entrar</Link>
                    )}
                </div>
            )}
        </header>
    );
}