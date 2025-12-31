import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Coluna 1: Logo e Descrição */}
                <div style={styles.column}>
                    <div style={styles.logoSection}>
                        <img src="/logo.png" alt="Logo" style={styles.logoImg} />
                        <span style={styles.logoText}>Calculadora de Churrasco</span>
                    </div>
                    <p style={styles.description}>
                        A solução inteligente para organizar seu churrasco sem desperdícios.
                    </p>
                </div>

                {/* Coluna 2: Navegação */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Links Úteis</h4>
                    <nav style={styles.nav}>
                        <Link to="/sobre" style={styles.link}>Sobre Nós</Link>
                        <Link to="/dicas" style={styles.link}>Dicas de Mestre</Link>
                        <Link to="/receitas" style={styles.link}>Receitas</Link>
                        <Link to="/produtos" style={styles.link}>Produtos</Link>
                    </nav>
                </div>

                {/* Coluna 3: Contato/Social */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Contato</h4>
                    <p style={styles.link}>contato@zornoff.com.br</p>
                    <div style={styles.socialRow}>
                        {/* Você pode trocar os emojis por ícones de biblioteca se preferir */}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialIcon}>📸 Instagram</a>
                    </div>
                </div>
            </div>

            <div style={styles.bottomBar}>
                <p style={styles.copyright}>
                    © {new Date().getFullYear()} Calculadora de Churrasco - Desenvolvido por Zornoff.
                </p>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#1a1a1a',
        color: '#ccc',
        padding: '40px 0 0 0',
        marginTop: '60px',
        borderTop: '3px solid #ff5252',
        fontFamily: "'Segoe UI', Roboto, sans-serif"
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: '30px'
    },
    column: {
        flex: '1',
        minWidth: '250px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
    },
    logoImg: { height: '35px', width: 'auto' },
    logoText: { color: '#ff5252', fontSize: '20px', fontWeight: 'bold' },
    description: { fontSize: '14px', lineHeight: '1.6' },
    heading: { color: '#fff', fontSize: '16px', marginBottom: '15px', textTransform: 'uppercase' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    link: { color: '#aaa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' },
    socialRow: { marginTop: '10px' },
    socialIcon: { color: '#ff5252', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
    bottomBar: {
        borderTop: '1px solid #333',
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center'
    },
    copyright: { fontSize: '12px', color: '#666', margin: 0 }
};