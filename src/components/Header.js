import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { headerStyles as styles } from '../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;


export default function Header({ usuario }) {
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
        <header style={styles.header}>
            <div style={styles.container}>
                <div style={styles.leftSection}>
                    <Link to="/" style={styles.logoLink} onClick={() => setMenuAberto(false)}>
                        <img 
                            src="/logo.png" 
                            alt="Calculadora de Churrasco" 
                            style={styles.logoImg} 
                        /><span style={styles.logoText}>Calculadora</span>
                    </Link>

                    {!isMobile && (
                        <nav style={styles.mainNav}>
                            <Link to="/dicas" style={styles.navLink}>Dicas</Link>
                            <Link to="/produtos" style={styles.navLink}>Produtos</Link>
                            <Link to="/receitas" style={styles.navLink}>Receitas</Link>
                            <Link to="/utensilios" style={styles.navLink}>Utensílios</Link>
                            <Link to="/sobre" style={styles.navLink}>Sobre</Link>
                        </nav>
                    )}
                </div>

                <div style={styles.rightSection}>
                    {usuario ? (
                        <div style={styles.userSection}>
                            {usuario?.role === 'admin' && !isMobile && (
                                <div 
                                    style={styles.dropdownContainer}
                                    onMouseEnter={() => setDropdownAberto(true)}
                                    onMouseLeave={() => setDropdownAberto(false)}
                                >
                                    <button style={styles.adminDropdownBtn}>
                                        🛠️ Admin ▼
                                    </button>

                                    {dropdownAberto && (
                                        <div style={styles.dropdownMenu}>
                                            <Link to="/admin" style={styles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                ⚙️ Itens
                                            </Link>
                                            <Link to="/admin/conteudo" style={styles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                📝 Conteúdo
                                            </Link>
                                            <Link to="/admin/usuarios" style={styles.dropdownItem} onClick={() => setDropdownAberto(false)}>
                                                👥 Usuários
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div style={styles.profile}>
                                <img src={usuario.avatar} alt="Avatar" style={styles.avatar} />
                                {!isMobile && <span style={styles.userName}>{usuario.nome.split(' ')[0]}</span>}
                            </div>

                            {!isMobile && (
                                <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
                            )}
                        </div>
                    ) : (
                        !isMobile && <Link to="/login" style={styles.loginBtn}>Entrar</Link>
                    )}

                    {isMobile && (
                        <button onClick={() => setMenuAberto(!menuAberto)} style={styles.hamburger}>
                            {menuAberto ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* MENU MOBILE */}
            {isMobile && menuAberto && (
                <div style={styles.mobileMenu}>
                    <Link to="/dicas" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>Dicas</Link>
                    <Link to="/produtos" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>Produtos</Link>
                    <Link to="/receitas" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>Receitas</Link>
                    <Link to="/utensilios" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>Utensílios</Link>
                    <Link to="/sobre" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>Sobre</Link>
                    <hr style={styles.divider} />
                    <span style={{color: '#FFC107'}}>Administração:</span>
                        {usuario?.role === 'admin' && (
                            <>
                                <Link to="/admin" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>⚙️ Itens</Link>
                                <Link to="/admin/conteudo" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>📝 Conteúdo</Link>
                                <Link to="/admin/usuarios" style={styles.mobileNavLink} onClick={() => setMenuAberto(false)}>👥 Usuários</Link>
                            </>
                        )}
                    <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Sair da Conta</button>
                </div>
            )}
        </header>
    );
}