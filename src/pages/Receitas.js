import React, { useState } from 'react';
import { commonStyles as styles, modalStyles } from '../components/Styles';

const Receitas = () => {
    const [receitaAtiva, setReceitaAtiva] = useState(null);

    const listaReceitas = [
        { 
            id: 1, 
            prato: "Picanha no Alho", 
            tempo: "40 min", 
            dificuldade: "Fácil",
            ingredientes: ["1 peça de Picanha", "5 dentes de alho amassados", "Sal grosso", "Azeite"],
            preparo: "Misture o alho com azeite e passe na carne. Cubra com sal grosso e leve à grelha com a gordura para cima primeiro."
        },
        { 
            id: 2, 
            prato: "Maionese de Batata", 
            tempo: "30 min", 
            dificuldade: "Média",
            ingredientes: ["500g de batatas", "3 ovos cozidos", "Maionese a gosto", "Cheiro verde"],
            preparo: "Cozinhe as batatas em cubos. Misture com os ovos picados e a maionese. Finalize com cheiro verde."
        },
        { 
            id: 3, 
            prato: "Pão de Alho Caseiro", 
            tempo: "15 min", 
            dificuldade: "Fácil",
            ingredientes: ["Pão francês", "Maionese", "Alho", "Queijo parmesão", "Orégano"],
            preparo: "Corte os pães sem separar as fatias. Recheie com o creme de alho e queijo. Leve à churrasqueira até dourar."
        }
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Receitas de Sucesso</h1>
                <p style={styles.subtitle}>Acompanhamentos e preparos especiais</p>
            </header>
            <div style={styles.grid}>
                {listaReceitas.map(r => (
                    <div key={r.id} style={{...styles.card, borderTopColor: '#4caf50'}}>
                        <h3 style={styles.cardTitle}>🍳 {r.prato}</h3>
                        <div style={{fontSize: '13px', color: '#888', marginTop: '5px'}}>
                            ⏱ {r.tempo} | 📊 {r.dificuldade}
                        </div>
                        <button 
                            style={styles.viewBtn}
                            onClick={() => setReceitaAtiva(r)}
                        >Ver Receita</button>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {receitaAtiva && (
                <div style={modalStyles.overlay} onClick={() => setReceitaAtiva(null)}>
                    <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                        <button style={modalStyles.closeBtn} onClick={() => setReceitaAtiva(null)}>✕</button>
                        <h2 style={{color: '#1a1a1a'}}>{receitaAtiva.prato}</h2>
                        
                        <h4 style={modalStyles.sectionTitle}>🛒 Ingredientes:</h4>
                        <ul style={modalStyles.list}>
                            {receitaAtiva.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>

                        <h4 style={modalStyles.sectionTitle}>👨‍🍳 Modo de Preparo:</h4>
                        <p style={modalStyles.text}>{receitaAtiva.preparo}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Receitas;