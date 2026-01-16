import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Footer({dados, footerStyles}) {
    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.container}>
                {/* Coluna 1: Logo e Descrição */}
                <div style={footerStyles.column}>
                    <div style={footerStyles.logoSection}>
                        <img 
                            src={dados.logoUrl ? `${API_URL}${dados.logoUrl}` : '/logos/logo.png'}
                            alt={dados.nomeApp} style={footerStyles.logoImg} />
                        <span style={footerStyles.logoText}>{dados.nomeApp}</span>
                    </div>
                    <p style={footerStyles.description}>
                        A solução inteligente para organizar seu churrasco sem desperdícios.
                    </p>
                </div>

                {/* Coluna 2: Navegação */}
                <div style={footerStyles.column}>
                    <h4 style={footerStyles.heading}>Links Úteis</h4>
                    <nav style={footerStyles.nav}>
                        <Link to="/sobre" style={footerStyles.link}>Sobre Nós</Link>
                        <Link to="/dicas" style={footerStyles.link}>Dicas de Mestre</Link>
                        <Link to="/receitas" style={footerStyles.link}>Receitas</Link>
                        <Link to="/produtos" style={footerStyles.link}>Produtos</Link>
                    </nav>
                </div>

                {/* Coluna 3: Contato/Social */}
                <div style={footerStyles.column}>
                    <h4 style={footerStyles.heading}>Contato</h4>
                    <a href={`mailto:${dados.email}`} target="_blank" rel="noreferrer" style={footerStyles.socialIcon}>{dados.email}</a>
                    <div style={footerStyles.socialRow}>
                        {/* Você pode trocar os emojis por ícones de biblioteca se preferir */}
                        <a href={dados.instagram} target="_blank" rel="noreferrer" style={footerStyles.socialIcon}>Instagram</a>
                    </div>
                </div>
            </div>

            <div style={footerStyles.bottomBar}>
                <p style={footerStyles.copyright}>
                    © {new Date().getFullYear()} Calculadora de Churrasco - Desenvolvido por <a href='https://www.zornoff.com.br' target="_blank" rel="noreferrer" style={footerStyles.socialIcon}>Zornoff</a>.
                </p>
            </div>
        </footer>
    );
}