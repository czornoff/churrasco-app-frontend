import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const EMOJIS = {
    'Bovina': '🥩',
    'Suína': '🥓',
    'Frango': '🐔',
    'Linguiça': '🌭',
    'Outras': '🍖',
    'bebidas': '🍺',
    'adicionais': '🧂',
    'acompanhamentos': '🥗',
    'utensilios': '🍴'
};

export default function Calculadora({ opcoes }) {
    const [selecionados, setSelecionados] = useState([]);
    // 1. ESTADO ATUALIZADO
    const [pessoas, setPessoas] = useState({ 
        homens: 0, 
        mulheres: 0, 
        criancas: 0, 
        adultosQueBebem: 0,
        horas: 4 // Valor padrão sugerido
    });
    const [resultado, setResultado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const handleToggle = (id) => setSelecionados(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    const calcular = async () => {
        if (pessoas.homens === 0 && pessoas.mulheres === 0 && pessoas.criancas === 0) {
            return alert("Informe o número de pessoas");
        }
        
        const res = await fetch(`${API_URL}/api/calcular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ...pessoas, selecionados })
        });
        const data = await res.json();
        setResultado(data);
        setModalAberto(true);
    };

    // 2. WHATSAPP ATUALIZADO COM HOMENS E MULHERES
    const enviarWhatsApp = (p, resultados) => {
        const nomeResponsavel = prompt("Qual o seu nome?", "Mestre do Churrasco");
        if (nomeResponsavel === null) return;

        let texto = `*🔥 LISTA DE CHURRASCO 🔥*\n`;
        texto += `----------------------------\n`;
        texto += `👤 *Organizador:* ${nomeResponsavel}\n`;
        texto += `👥 *Público:* \n`;
        texto += `🧔 ${p.homens} Homens | 👩 ${p.mulheres} Mulheres | 👶 ${p.criancas} Crianças\n`;
        texto += `🍻 Bebem álcool: ${p.adultosQueBebem}\n`;
        texto += `----------------------------\n\n`;
        
        texto += `*📋 ITENS NECESSÁRIOS:*\n`;

        // Separando categorias para a mensagem
        const comida = resultados.filter(r => r.tipo === 'comida');
        const naoAlcoolicas = resultados.filter(r => r.tipo === 'bebida' && !r.nome.includes('🍻') && r.subtipo !== 'observacao');
        const alcoolicas = resultados.filter(r => r.tipo === 'bebida' && r.nome.includes('🍻'));
        const outros = resultados.filter(r => r.tipo === 'outros');
        
        // Pegando as observações de litros
        const obsNaoAlcool = resultados.find(r => r.nome.includes('NÃO alcoólica'))?.quantidade;
        const obsAlcool = resultados.find(r => r.nome.includes('alcoólica') && !r.nome.includes('NÃO'))?.quantidade;

        if (comida.length > 0) {
            texto += `*🥩 COMIDA:* \n`;
            comida.forEach(item => texto += `• ${item.nome}: ${item.quantidade}\n`);
            texto += `\n`;
        }

        if (naoAlcoolicas.length > 0) {
            texto += `*🥤 BEBIDAS NÃO ALCOÓLICAS:* \n`;
            if (obsNaoAlcool) texto += `_Total estimado: ${obsNaoAlcool}_\n`;
            naoAlcoolicas.forEach(item => texto += `• ${item.nome.replace('🥤 ', '')}: ${item.quantidade}\n`);
            texto += `\n`;
        }

        if (alcoolicas.length > 0) {
            texto += `*🍻 BEBIDAS ALCOÓLICAS:* \n`;
            if (obsAlcool) texto += `_Total estimado: ${obsAlcool}_\n`;
            alcoolicas.forEach(item => texto += `• ${item.nome.replace('🍻 ', '')}: ${item.quantidade}\n`);
            texto += `\n`;
        }

        if (outros.length > 0) {
            texto += `*🍴 UTENSÍLIOS:* \n`;
            outros.forEach(item => texto += `• ${item.nome.replace('🍴 ', '')}: ${item.quantidade}\n`);
        }

        texto += `\n_Gerado por ChurrasCalculadora_`;
        const linkFinal = `https://api.whatsapp.com/send/?text=${encodeURIComponent(texto)}`;
        window.open(linkFinal, '_blank');
    };

    const ColunaCarne = (sub) => (
        <div key={sub} style={{ flex: 1, border: '1px solid #ddd', padding: '10px', borderRadius: '4px', minWidth: '150px' }}>
            <strong style={{ color: '#e53935', display: 'block', marginBottom: '8px' }}>{EMOJIS[sub]} {sub.toUpperCase()}</strong>
            {opcoes.carnes
            .filter(c => c.subcategoria === sub && c.ativo)
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map(c => (
                <div key={c.id} style={{ marginBottom: '4px' }}>
                    <input type="checkbox" id={`it-${c.id}`} onChange={() => handleToggle(c.id)} />
                    <label htmlFor={`it-${c.id}`} style={{ marginLeft: '5px', cursor: 'pointer' }}>{c.nome}</label>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* 3. INPUTS DE PESSOAS ATUALIZADOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '20px', marginBottom: '20px', background: '#f9f9f9', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🧔 Homens</label>
                    <input type="number" min="0" value={pessoas.homens} style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, homens: parseInt(e.target.value) || 0 })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>👩 Mulheres</label>
                    <input type="number" min="0" value={pessoas.mulheres} style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, mulheres: parseInt(e.target.value) || 0 })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🍺 Bebem Álcool</label>
                    <input 
                        type="number" 
                        min="0" 
                        // A trava visual: o valor máximo permitido é a soma de homens + mulheres
                        max={pessoas.homens + pessoas.mulheres} 
                        value={pessoas.adultosQueBebem} 
                        style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                        onChange={e => {
                            const totalAdultos = pessoas.homens + pessoas.mulheres;
                            let valor = parseInt(e.target.value) || 0;
                            
                            // Se o usuário tentar digitar um número maior que o total de adultos
                            if (valor > totalAdultos) {
                                valor = totalAdultos;
                            }
                            
                            setPessoas({ ...pessoas, adultosQueBebem: valor });
                        }} 
                    />
                    <small style={{ color: '#888', fontSize: '10px' }}>Máximo: {pessoas.homens + pessoas.mulheres} adultos</small>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>👶 Crianças</label>
                    <input type="number" min="0" value={pessoas.criancas} style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, criancas: parseInt(e.target.value) || 0 })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>⏱️ Horas</label>
                    <input type="number" min="4" value={pessoas.horas} style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                            onChange={e => setPessoas({ ...pessoas, horas: parseInt(e.target.value) || 1 })} />
                    <small style={{ color: '#888', fontSize: '10px' }}>Mínimo: 4 horas</small>
                </div>
            </div>

            <section>
                <h3>Selecione as Carnes</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                    {['Bovina', 'Suína', 'Frango', 'Linguiça', 'Outras'].map(s => ColunaCarne(s))}
                </div>
            </section>

            {/* Restante do código (Outros itens, botão calcular) permanece similar */}
            <h3>Outros Itens</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                {['bebidas', 'adicionais', 'acompanhamentos', 'utensilios'].map(cat => (
                    <div key={cat} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                        <strong style={{ textTransform: 'uppercase', fontSize: '16px', color: '#666', display: 'block', marginBottom: '10px' }}>
                            {EMOJIS[cat]} {cat}
                        </strong>
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
                📑 GERAR LISTA DE COMPRAS
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

function ModalResultado({ resultado, pessoas, enviarWhatsApp, fechar }) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto' }}>
                <h2 style={{ color: '#e53935', marginTop: 0 }}>📋 Lista Gerada</h2>
                
                {/* INFO DE PESSOAS NO MODAL */}
                <div style={{ fontSize: '14px', background: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                    🧔 {pessoas.homens} | 👩 {pessoas.mulheres} | 👶 {pessoas.criancas} | ⏱️ {pessoas.horas}h
                </div>

                <button 
                    onClick={() => enviarWhatsApp(pessoas, resultado)}
                    style={{
                        backgroundColor: '#25D366', color: 'white', padding: '15px', border: 'none',
                        borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%',
                        marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    📱 Enviar para WhatsApp
                </button>

                <hr />
                {['comida', 'bebida', 'outros'].map(tipo => (
                    <div key={tipo} style={{ marginBottom: '20px' }}>
                        <h4 style={{ textTransform: 'uppercase', color: '#777', marginBottom: '10px' }}>{tipo}</h4>
                        {resultado.filter(r => r.tipo === tipo).map((r, i) => {
                            const isObs = r.subtipo === 'observacao';
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ fontSize: isObs ? '12px' : '16px', color: isObs ? '#777' : '#333' }}>{ r.nome }</span>
                                    <strong style={{ fontSize: isObs ? '12px' : '16px', color: isObs ? '#777' : '#333' }}>{ r.quantidade }</strong>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <button onClick={fechar} style={{ width: '100%', padding: '15px', background: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>FECHAR</button>
            </div>
        </div>
    );
}