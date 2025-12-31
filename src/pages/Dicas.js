import React from 'react';
import { commonStyles as styles } from '../components/Styles'; // Importando aqui

export default function Dicas({ dados }) {
    // Caso o conteúdo ainda não tenha sido populado no banco
    if (!dados || !dados.itens) {
        return <div style={styles.container}>Nenhuma dica cadastrada ainda. 🔥</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.titulo || 'Dicas de Mestre'}</h1>
                <p style={styles.subtitle}>{dados.subtitulo || 'Truques para o churrasco perfeito'}</p>
            </header>

            <div style={styles.grid}>
                {dados.itens.map((item, index) => (
                    <div key={index} style={styles.card}>
                        <h3 style={styles.cardTitle}>{item.icone || '💡'} {item.titulo}</h3>
                        <p style={styles.cardText}>{item.texto}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}