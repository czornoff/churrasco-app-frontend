import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Header({ usuario }) {
    const handleLogout = () => {
        window.location.href = `${API_URL}/auth/logout`;
    };

    return (
        <header style={styles.header}>
        <div style={styles.logo}>
            <Link to="/" style={styles.logoLink}>🔥 Calculadora de Churrasco</Link>
        </div>

        <nav style={styles.nav}>
            {usuario ? (
            <div style={styles.userSection}>
                {/* Link exclusivo para Admin */}
                {usuario.role === 'admin' && (
                <Link to="/admin" style={styles.adminLink}>Painel Admin</Link>
                )}
                
                <div style={styles.profile}>
                <img src={usuario.avatar} alt="Avatar" style={styles.avatar} />
                <span style={styles.userName}>{usuario.nome.split(' ')[0]}</span>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
            </div>
            ) : (
            <Link to="/login" style={styles.loginBtn}>Entrar</Link>
            )}
        </nav>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#333',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    logoLink: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#e53935',
        textDecoration: 'none'
    },
    nav: {
        display: 'flex',
        alignItems: 'center'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderLeft: '1px solid #555',
        paddingLeft: '20px'
    },
    avatar: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        border: '2px solid #e53935'
    },
    userName: {
        fontSize: '14px',
        fontWeight: '500'
    },
    adminLink: {
        color: '#ffc107',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#bbb',
        border: '1px solid #555',
        padding: '5px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    loginBtn: {
        backgroundColor: '#e53935',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 20px',
        borderRadius: '6px',
        fontWeight: 'bold'
    }
};