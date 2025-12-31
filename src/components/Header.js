import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
                            alt="Logo Calculadora de Churrasco" 
                            style={styles.logoImg} 
                        /><span style={styles.logoText}>Calculadora de Churrasco</span>
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

const styles = {
    header: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        height: '70px'
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
    },
    logoLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    logoImg: {
        height: '100px',  // Ajuste a altura conforme necessário
        width: 'auto',   // Mantém a proporção
        display: 'block',
        marginTop: '30px' // Ajuste vertical para alinhar com o texto
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#ff5252',
    },
    mainNav: {
        display: 'flex',
        gap: '20px'
    },
    navLink: {
        color: '#efefef',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row', // Garante alinhamento horizontal
        alignItems: 'center',
        gap: '15px'
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    avatar: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '2px solid #ff5252',
        objectFit: 'cover'
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff'
    },
    adminLink: {
        color: '#ffc107',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        border: '1px solid #ffc107',
        padding: '5px 10px',
        borderRadius: '4px'
    },
    logoutBtn: {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #444',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
    },
    hamburger: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '28px',
        cursor: 'pointer'
    },
    mobileMenu: {
        position: 'absolute',
        top: '70px',
        left: 0,
        width: '100%',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '15px',
        borderTop: '1px solid #333'
    },
    mobileNavLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    divider: { width: '100%', borderColor: '#333', margin: '5px 0' },
    mobileLogoutBtn: {
        backgroundColor: '#ff5252',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    loginBtn: {
        backgroundColor: '#ff5252',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 20px',
        borderRadius: '4px',
        fontWeight: 'bold'
    },
    dropdownContainer: {
        position: 'relative',
        display: 'inline-block'
    },
    adminDropdownBtn: {
        backgroundColor: '#333',
        color: '#ffc107',
        border: '1px solid #ffc107',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: '#222',
        minWidth: '180px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        borderRadius: '4px',
        zIndex: 1100,
        padding: '5px 0',
        border: '1px solid #444',
        marginTop: '5px'
    },
    dropdownItem: {
        color: '#fff',
        padding: '12px 16px',
        textDecoration: 'none',
        display: 'block',
        fontSize: '14px',
        transition: 'background 0.2s',
        textAlign: 'left'
    },
    dropdownDivider: {
        height: '1px',
        backgroundColor: '#444',
        margin: '5px 0'
    },
};