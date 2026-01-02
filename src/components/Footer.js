import React from 'react';
import { Link } from 'react-router-dom';
import { footerStyles as styles } from '../components/Styles';

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