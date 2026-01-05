import React, { useState } from 'react';

const Receitas = ({ dados, styles, modalStyles }) => {
    const [receitaAtiva, setReceitaAtiva] = useState(null);

    if (!dados) return <div style={styles.loading}>Carregando receitas...</div>;

    const listaReceitas = dados.itens || [];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.titulo || "Receitas de Sucesso"}</h1>
                <p style={styles.subtitle}>{dados.subtitulo || "Acompanhamentos e preparos especiais"}</p>
            </header>

            <div style={styles.grid}>
                {listaReceitas.map((r, index) => (
                    <div key={index} style={styles.card}>
                        <h3 style={styles.cardTitle}>{r.icone || '🍳'} {r.titulo}</h3>
                        <div style={styles.recipeBadge}>
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
                        
                        <h2 style={styles.modalHeader}>{receitaAtiva.titulo}</h2>
                        
                        <div style={styles.infoRow}>
                            <span>⏱ <strong>Tempo:</strong> {receitaAtiva.tempo}</span>
                            <span>📊 <strong>Nível:</strong> {receitaAtiva.nivel}</span>
                        </div>

                        <h4 style={modalStyles.sectionTitle}>🛒 Ingredientes</h4>
                        <p style={styles.preLineText}>
                            {Array.isArray(receitaAtiva.ingredientes) 
                                ? receitaAtiva.ingredientes.join('\n') 
                                : receitaAtiva.ingredientes || ''}
                        </p>

                        <h4 style={modalStyles.sectionTitle}>👨‍🍳 Modo de Preparo:</h4>
                        <p style={styles.preLineText}>
                            {receitaAtiva.preparo}
                        </p>
                    </div>
                </div>
            )}

            {listaReceitas.length === 0 && (
                <p style={styles.emptyMsg}>Nenhuma receita cadastrada no momento.</p>
            )}
        </div>
    );
};

export default Receitas;