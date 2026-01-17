import React from 'react';
import { Link } from 'react-router-dom';

export default function Inicial({ dados, styles }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!dados) return <div style={styles.container}>Carregando...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.inicioTitulo || ''}</h1>
                <div style={{marginTop: '2em'}}>
                    <Link to="/calculadora" style={{ ...styles.viewBtn, width: '20em', fontSize: '1em', textDecoration: 'none'}}>
                        🔥 PLANEJE SEU CHURRASCO AGORA! 🔥
                    </Link>
                </div>
            </header>

            <div style={styles.contentWrapper}>
                {/* Renderiza o HTML do TinyMCE que veio do banco */}
                <div 
                    className="html-content"
                    style={styles.cardText}
                    dangerouslySetInnerHTML={{ __html: dados.inicioTexto || '' }} 
                />
            </div>
        </div>
    );
}