import React from 'react';
import { commonStyles as styles } from '../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;

export default function Sobre({ dados }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!dados) return <div style={styles.container}>Carregando...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.sobreTitulo || 'Nossa História'}</h1>
            </header>

            <div style={contentWrapper}>
                {/* Renderiza o HTML do TinyMCE que veio do banco */}
                <div 
                    className="html-content"
                    dangerouslySetInnerHTML={{ __html: dados.sobreTexto || '<p>História em breve...</p>' }} 
                />
            </div>
        </div>
    );
}

// Estilos para deixar o texto bonito
const contentWrapper = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    marginTop: '20px',
    lineHeight: '1.8', // Espaçamento entre linhas para leitura fácil
    fontSize: '16px',
    color: '#333',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};