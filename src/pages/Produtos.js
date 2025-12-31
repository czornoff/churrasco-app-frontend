import React from 'react';
import { commonStyles as styles } from '../components/Styles'; // Importando aqui

const Produtos = () => {
    const listaProdutos = [
        { id: 1, nome: "Kit Churrasco Premium", preco: "R$ 149,90", desc: "Faca, garfo e pegador em aço inox com maleta." },
        { id: 2, nome: "Tábua de Corte Artesanal", preco: "R$ 89,00", desc: "Madeira nobre tratada com óleo mineral." },
        { id: 3, nome: "Carvão Vegetal 8kg", preco: "R$ 45,00", desc: "Eucalipto de alta densidade, maior duração." }
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Produtos Selecionados</h1>
                <p style={styles.subtitle}>Os melhores itens para o seu evento</p>
            </header>
            <div style={styles.grid}>
                {listaProdutos.map(p => (
                    <div key={p.id} style={styles.card}>
                        <h3 style={styles.cardTitle}>{p.nome}</h3>
                        <span style={styles.price}>{p.preco}</span>
                        <p style={styles.cardText}>{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Produtos;