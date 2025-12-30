import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Calculadora({ opcoes }) {
    const [selecionados, setSelecionados] = useState([]);
    const [pessoas, setPessoas] = useState({ adultos: 0, criancas: 0 });
    const [resultado, setResultado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const handleToggle = (id) => setSelecionados(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    const calcular = async () => {
        if (pessoas.adultos === 0 && pessoas.criancas === 0) return alert("Informe o número de pessoas");
        
        const res = await fetch(`${API_URL}/calcular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...pessoas, selecionados })
        });
        const data = await res.json();
        setResultado(data);
        setModalAberto(true);
    };

    const enviarWhatsApp = (adultos, criancas, resultados) => {
        const nomeResponsavel = prompt("Qual o seu nome?", "Mestre do Churrasco");

        if (nomeResponsavel === null) return;

        let texto = `*🔥 LISTA DE CHURRASCO 🔥*\n`;
        texto += `----------------------------\n`;
        texto += `👤 *Organizador:* ${nomeResponsavel}\n`;
        texto += `👥 *Público:*\n`;
        texto += `• Adultos: ${adultos}\n`;
        texto += `• Crianças: ${criancas}\n`;
        texto += `----------------------------\n\n`;
        
        texto += `*📋 ITENS NECESSÁRIOS:*\n`;

        resultados.forEach(item => {
            const unit = item.ml ? 'ml' : (item.unidade || 'g');
            const valor = item.quantidade || item.ml || 0;
            
            let valorFormatado = valor;

            if (unit === 'g' && valor >= 1000) {
                valorFormatado = (valor / 1000).toFixed(2);
            } 

            texto += `• *${item.nome}*: ${valorFormatado}\n`;
        });

        texto += `\n_Gerado pelo Cálculo de Churrasco 🚀_`;

        // 2. O SEGREDO: Usamos o encodeURIComponent para proteger os emojis e acentos
        const linkFinal = `https://api.whatsapp.com/send/?text=${encodeURIComponent(texto)}`;

        // 3. Abrir o link
        window.open(linkFinal, '_blank');
    };

    const ColunaCarne = (sub) => (
        <div key={sub} style={{ flex: 1, border: '1px solid #ddd', padding: '10px', borderRadius: '4px', minWidth: '150px' }}>
            <strong style={{ color: '#e53935', display: 'block', marginBottom: '8px' }}>{sub}</strong>
            {opcoes.carnes.filter(c => c.subcategoria === sub && c.ativo).map(c => (
                <div key={c.id} style={{ marginBottom: '4px' }}>
                    <input type="checkbox" id={`it-${c.id}`} onChange={() => handleToggle(c.id)} />
                    <label htmlFor={`it-${c.id}`} style={{ marginLeft: '5px', cursor: 'pointer' }}>{c.nome}</label>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#f9f9f9', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Adultos</label>
                    <input type="number" min="0" value={pessoas.adultos} style={{ width: '80%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, adultos: parseInt(e.target.value) || 0 })} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Crianças</label>
                    <input type="number" min="0" value={pessoas.criancas} style={{ width: '80%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, criancas: parseInt(e.target.value) || 0 })} />
                </div>
            </div>

            <section>
                <h3>🥩 Selecione as Carnes</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                    {['Bovina', 'Suína', 'Frango', 'Linguiça', 'Outras'].map(s => ColunaCarne(s))}
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                {['bebidas', 'adicionais', 'acompanhamentos', 'utensilios'].map(cat => (
                    <div key={cat} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                        <strong style={{ textTransform: 'uppercase', fontSize: '12px', color: '#666', display: 'block', marginBottom: '10px' }}>{cat}</strong>
                        {opcoes[cat].filter(i => i.ativo).map(i => (
                            <div key={i.id} style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                <input type="checkbox" id={`it-${i.id}`} onChange={() => handleToggle(i.id)} />
                                <label htmlFor={`it-${i.id}`} style={{ marginLeft: '8px', cursor: 'pointer', fontSize: '14px' }}>{i.nome}</label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button onClick={calcular} style={{ 
                width: '100%', margin: '40px 0', padding: '20px', 
                background: '#e53935', color: 'white', fontWeight: 'bold', 
                fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(229, 57, 53, 0.3)' 
            }}>
                GERAR LISTA DE COMPRAS
            </button>

            {modalAberto && (
                <ModalResultado 
                    resultado={resultado} 
                    pessoas={pessoas} 
                    enviarWhatsApp={enviarWhatsApp} 
                    fechar={() => setModalAberto(false)} 
                />
            )}
        </div>
    );
}

// Sub-componente do Modal (pode ser movido para arquivo próprio depois)
function ModalResultado({ resultado, pessoas, enviarWhatsApp, fechar }) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto' }}>
                <h2 style={{ color: '#e53935', marginTop: 0 }}>📋 Lista Gerada</h2>
                <hr />
                {resultado && resultado.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <button 
                            onClick={() => enviarWhatsApp(pessoas.adultos, pessoas.criancas, resultado)}
                            style={{
                                backgroundColor: '#25D366',
                                color: 'white',
                                padding: '15px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '15px'
                            }}
                        >
                            <span>📱 Enviar Lista para o WhatsApp</span>
                        </button>
                    </div>
                )}
                <hr />
                {['comida', 'bebida', 'outros'].map(tipo => (
                    <div key={tipo} style={{ marginBottom: '20px' }}>
                        <h4 style={{ textTransform: 'uppercase', color: '#777', marginBottom: '10px' }}>{tipo}</h4>
                        {resultado.filter(r => r.tipo === tipo).map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <span>{r.nome}</span>
                                <strong>{r.quantidade}</strong>
                            </div>
                        ))}
                    </div>
                ))}
                <button onClick={fechar} style={{ width: '100%', padding: '15px', background: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>FECHAR</button>
            </div>
        </div>
    );
}