import React from 'react';
import { commonStyles as styles } from '../components/Styles'; // Importando aqui

const Dicas = () => {
    const listaDicas = [
        {
            id: 1,
            titulo: "🔥 O Ponto do Braseiro",
            descricao: "O momento ideal é quando o carvão está coberto por uma fina camada de cinza branca (o braseiro). Evite labaredas que queimam a carne por fora e a deixam crua por dentro."
        },
        {
            id: 2,
            titulo: "🧂 Salgar na Hora Certa",
            descricao: "Para cortes grossos, use sal grosso. Para cortes finos, prefira sal de parrilla. Salgue apenas alguns minutos antes de levar ao fogo para não desidratar a carne."
        },
        {
            id: 3,
            titulo: "⏳ O Descanso é Sagrado",
            descricao: "Ao tirar a carne da grelha, espere de 2 a 5 minutos antes de fatiar. Isso permite que os sucos se redistribuam, garantindo uma carne muito mais suculenta."
        },
        {
            id: 4,
            titulo: "🔪 Contra a Fibra",
            descricao: "Sempre identifique a direção das fibras da carne e corte no sentido transversal (oposto) a elas. Isso rompe as fibras e torna a mastigação muito mais macia."
        }
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Dicas de Mestre</h1>
                <p style={styles.subtitle}>Segredos para elevar o nível do seu churrasco</p>
            </header>

            <div style={styles.grid}>
                {listaDicas.map(dica => (
                    <div key={dica.id} style={styles.card}>
                        <h3 style={styles.cardTitle}>{dica.titulo}</h3>
                        <p style={styles.cardText}>{dica.descricao}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dicas;