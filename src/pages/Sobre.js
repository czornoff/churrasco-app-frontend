import React from 'react';

export default function Sobre({ dados, styles }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!dados) return <div style={styles.container}>Carregando...</div>;

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
        </div>
    );
}