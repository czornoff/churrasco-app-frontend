import React from 'react';

const VERSION = process.env.REACT_APP_VERSION || 'desconhecida';

export default function Sobre({ dados, styles }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!dados) return <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f8f9fa',
            fontFamily: 'sans-serif'
        }}>
            {/* Ícone ou Logo Animado */}
            <div style={{
                fontSize: '50px',
                marginBottom: '20px',
                animation: 'pulse 1.5s infinite ease-in-out'
            }}>
                🔥
            </div>

            {/* Texto de Carregamento */}
            <h2 style={{ 
                color: '#d9534f', 
                marginBottom: '10px',
                fontWeight: 'bold' 
            }}>
                Preparando a brasa...
            </h2>
            
            <p style={{ color: '#666', fontSize: '14px' }}>
                Carregando sobre
            </p>

            {/* CSS inline para a animação de pulso */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.sobreTitulo || 'Nossa História'}</h1>
            </header>

            <div style={styles.contentWrapper}>
                {/* Renderiza o HTML do TinyMCE que veio do banco */}
                <div 
                    className="html-content"
                    style={styles.cardText}
                    dangerouslySetInnerHTML={{ __html: dados.sobreTexto || '<p>História em breve...</p>' }} 
                />
            </div>
            <div style={{float: 'right', color: '#666', fontSize: '14px' }}>
                <span>Versão: { VERSION }</span>
            </div>
        </div>
    );
}