import React, { useState } from 'react';
import { commonStyles as styles, modalStyles } from '../components/Styles';

// Recebemos 'dados' que vem do App.js (do MongoDB)
const Receitas = ({ dados }) => {
    const [receitaAtiva, setReceitaAtiva] = useState(null);

    // Se o banco ainda não carregou, exibe um carregando amigável
    if (!dados) return <div style={{padding: '50px', textAlign: 'center'}}>Carregando receitas...</div>;

    // Usamos os itens vindos do banco, ou uma lista vazia caso não existam
    const listaReceitas = dados.itens || [];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                {/* Título e Subtítulo agora vêm do Admin */}
                <h1 style={styles.title}>{dados.titulo || "Receitas de Sucesso"}</h1>
                <p style={styles.subtitle}>{dados.subtitulo || "Acompanhamentos e preparos especiais"}</p>
            </header>

            <div style={styles.grid}>
                {listaReceitas.map((r, index) => (
                    <div key={index} style={{...styles.card, borderTopColor: '#4caf50'}}>
                        <h3 style={styles.cardTitle}>{r.icone || '🍳'} {r.titulo}</h3>
                        <div style={{fontSize: '13px', color: '#888', marginTop: '5px'}}>
                            ⏱ {r.tempo || 'N/A'} | 📊 {r.nivel || 'Fácil'}
                        </div>
                        <button 
                            style={styles.viewBtn}
                            onClick={() => setReceitaAtiva(r)}
                        >Ver Receita</button>
                    </div>
                ))}
            </div>

            {/* MODAL DE DETALHES */}
            {receitaAtiva && (
                <div style={modalStyles.overlay} onClick={() => setReceitaAtiva(null)}>
                    <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                        <button style={modalStyles.closeBtn} onClick={() => setReceitaAtiva(null)}>✕</button>
                        
                        <h2 style={{color: '#1a1a1a', marginBottom: '10px'}}>{receitaAtiva.titulo}</h2>
                        
                        <div style={{display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '14px', color: '#666'}}>
                            <span>⏱ <strong>Tempo:</strong> {receitaAtiva.tempo}</span>
                            <span>📊 <strong>Nível:</strong> {receitaAtiva.nivel}</span>
                        </div>
                        <h4 style={modalStyles.sectionTitle}>🛒 Ingredientes</h4>
                        <p style={{...modalStyles.text, whiteSpace: 'pre-line'}}>
                            {Array.isArray(receitaAtiva.ingredientes) ? receitaAtiva.ingredientes.join('\n') : receitaAtiva.ingredientes || ''}
                        </p>
                        <h4 style={modalStyles.sectionTitle}>👨‍🍳 Modo de Preparo:</h4>
                        {/* Renderiza o texto respeitando as quebras de linha do Admin */}
                        <p style={{...modalStyles.text, whiteSpace: 'pre-line'}}>
                            {receitaAtiva.preparo}
                        </p>
                    </div>
                </div>
            )}

            {listaReceitas.length === 0 && (
                <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>Nenhuma receita cadastrada no momento.</p>
            )}
        </div>
    );
};

export default Receitas;