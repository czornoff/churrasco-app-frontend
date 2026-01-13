import React from 'react';

export default function Utensilios({ dados, styles }) {
    if (!dados || !dados.itens) {
        return <div style={styles.container}>Nenhuma dica cadastrada ainda. 🔥</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.titulo || 'Utensílios Essenciais'}</h1>
                <p style={styles.subtitle}>{dados.subtitulo || 'Equipamentos que todo churrasqueiro precisa'}</p>
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