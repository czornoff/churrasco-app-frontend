import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Header({ dados, usuario, headerStyles, abrirPerfil }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [dropdownAberto, setDropdownAberto] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuAberto(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        window.location.href = `${API_URL}/auth/logout`;
    };

    return (
        <header style={headerStyles.header}>
            <div style={headerStyles.container}>
                <div style={headerStyles.leftSection}>
                    <Link to="/" style={headerStyles.logoLink} onClick={() => setMenuAberto(false)}>
                        <img 
                            src={dados.logoUrl ? `${API_URL}${dados.logoUrl}` : '/logos/logo.png'}
                            alt={dados.nomeApp} 
                            style={headerStyles.logoImg} 
                        />
                    </Link>

                    {!isMobile && (
                        <nav style={headerStyles.mainNav}>
                            <Link to="/" style={headerStyles.navLink}>Início</Link>
                            <Link to="/calculadora" style={headerStyles.navLink}>Calculadora</Link>
                            <Link to="/dicas" style={headerStyles.navLink}>Dicas</Link>
                            <Link to="/produtos" style={headerStyles.navLink}>Produtos</Link>
                            <Link to="/receitas" style={headerStyles.navLink}>Receitas</Link>
                            <Link to="/utensilios" style={headerStyles.navLink}>Utensílios</Link>
                            <Link to="/sobre" style={headerStyles.navLink}>Sobre</Link>
                        </nav>
                    )}
                </div>

                <div style={headerStyles.rightSection}>
                    {usuario ? (
                        <div style={headerStyles.userSection}>
                            {usuario?.role === 'admin' && !isMobile && (
                                <div 
                                    style={headerStyles.dropdownContainer}
                                    onMouseEnter={() => setDropdownAberto(true)}
                                    onMouseLeave={() => setDropdownAberto(false)}
                                >
                                    <button style={headerStyles.adminDropdownBtn}>
                                        🛠️ Admin ▼
                                    </button>

                                    {dropdownAberto && (
                                        <div style={headerStyles.dropdownMenu}>
                                            <Link to="/admin" style={headerStyles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                📱 Painel
                                            </Link>
                                            <Link to="/admin/conteudo" style={headerStyles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                📝 Conteúdo
                                            </Link>
                                            <Link to="/admin/item" style={headerStyles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                ⚙️ Itens
                                            </Link>
                                            <Link to="/admin/relatorio" style={headerStyles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                📊 Relatórios
                                            </Link>
                                            <Link to="/admin/usuarios" style={headerStyles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                👥 Usuários
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div style={headerStyles.profile} onClick={abrirPerfil}>
                                <img src={usuario.avatar} alt="Avatar" style={headerStyles.avatar} />
                                {!isMobile && <span style={headerStyles.userName}>{usuario.nome.split(' ')[0]} (perfil)</span>}
                            </div>

                            {!isMobile && (
                                <button onClick={handleLogout} style={headerStyles.logoutBtn}>Sair</button>
                            )}
                        </div>
                    ) : (
                        !isMobile && <Link to="/login" style={headerStyles.loginBtn}>Entrar</Link>
                    )}

                    {isMobile && (
                        <button onClick={() => setMenuAberto(!menuAberto)} style={headerStyles.hamburger}>
                            {menuAberto ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* MENU MOBILE */}
            {isMobile && menuAberto && (
                <div style={headerStyles.mobileMenu}>
                    <Link to="/" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Início</Link>
                    <Link to="/calculadora" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Calculadora</Link>
                    <Link to="/dicas" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Dicas</Link>
                    <Link to="/produtos" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Produtos</Link>
                    <Link to="/receitas" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Receitas</Link>
                    <Link to="/utensilios" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Utensílios</Link>
                    <Link to="/sobre" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>Sobre</Link>
                    <hr style={headerStyles.divider} />
                    <Link to="/sobre" style={headerStyles.mobileNavLink} onClick={() => {abrirPerfil(); setMenuAberto(false)}}>Perfil</Link>
                        {usuario?.role === 'admin' && (
                            <>
                            <hr style={headerStyles.divider} />
                            <span style={headerStyles.mobileTitle}>Administração:</span>
                                <Link to="/admin" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>📱 Painel</Link>
                                <Link to="/admin/conteudo" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>📝 Conteúdo</Link>
                                <Link to="/admin/item" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>⚙️ Itens</Link>
                                <Link to="/admin/relatorio" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>📊 Relatórios</Link>
                                <Link to="/admin/usuarios" style={headerStyles.mobileNavLink} onClick={() => setMenuAberto(false)}>👥 Usuários</Link>
                            <button onClick={handleLogout} style={headerStyles.mobileMenuBtn}>Sair da Conta</button>
                            </>
                        )}
                        {usuario?.role !== 'admin' && (
                            <>
                            <hr style={headerStyles.divider} />
                            <Link to="/login" style={headerStyles.mobileMenuBtn} onClick={() => setMenuAberto(false)}>Entrar</Link>
                            </>
                        )}
                </div>
            )}
        </header>
    );
}