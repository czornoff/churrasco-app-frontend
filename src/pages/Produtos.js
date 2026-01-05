import React from 'react';

export default function Produtos({ dados, styles }) {
    // Caso o conteúdo ainda não tenha sido populado no banco
    if (!dados || !dados.itens) {
        return <div style={styles.container}>Nenhuma dica cadastrada ainda. 🔥</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.titulo || 'Produtos'}</h1>
                <p style={styles.subtitle}>{dados.subtitulo || 'Os melhores itens para o seu evento'}</p>
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