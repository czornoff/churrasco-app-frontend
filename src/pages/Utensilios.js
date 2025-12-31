import React from 'react';
import { commonStyles as styles } from '../components/Styles'; // Importando aqui

const Utensilios = () => {
    const listaUtensilios = [
        { id: 1, item: "Faca do Chef", uso: "Para cortes precisos e fatiamento." },
        { id: 2, item: "Chaira (Afiador)", uso: "Manter o fio da faca durante o churrasco." },
        { id: 3, item: "Grelha Moeda", uso: "Ideal para cortes que precisam de marcação." },
        { id: 4, item: "Acendedor Elétrico", uso: "Praticidade para ligar o fogo sem esforço." }
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Utensílios Essenciais</h1>
                <p style={styles.subtitle}>Equipamentos que todo churrasqueiro precisa</p>
            </header>
            <div style={styles.grid}>
                {listaUtensilios.map(u => (
                    <div key={u.id} style={styles.card}>
                        <h3 style={styles.cardTitle}>🍴 {u.item}</h3>
                        <p style={styles.cardText}>{u.uso}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Utensilios;