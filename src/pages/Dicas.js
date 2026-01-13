import React from 'react';

export default function Dicas({ dados, styles }) {
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
                        <div 
                            className="html-content"
                            style={styles.cardText}
                            dangerouslySetInnerHTML={{ __html: item.texto || '<p>História em breve...</p>' }} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}