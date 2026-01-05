import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const EMOJIS = {
    'Bovina': '🥩', 
    'Suína': '🥓', 
    'Frango': '🐔', 
    'Linguiça': '🌭',
    'Outras': '🍖', 
    'bebidas': '🍺', 
    'adicionais': '🧀',
    'acompanhamentos': '🥗', 
    'utensilios': '🍴'
};

export default function Calculadora({ dados, opcoes, styles, modalStyles }) {
    const [selecionados, setSelecionados] = useState([]);
    const [pessoas, setPessoas] = useState({ 
        homens: 0, mulheres: 0, criancas: 0, adultosQueBebem: 0, horas: 4 
    });
    const [resultado, setResultado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [ajudaAberta, setAjudaAberta] = useState(false);

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

    const enviarWhatsApp = (p, resultados) => {
        const nomeResponsavel = prompt("Qual o seu nome?", "Mestre do Churrasco");
        if (nomeResponsavel === null) return;

        let texto = `*🔥 LISTA DE CHURRASCO 🔥*\n----------------------------\n`;
        texto += `👤 *Organizador:* ${nomeResponsavel}\n`;
        texto += `🧔 ${p.homens} | 👩 ${p.mulheres} | 👶 ${p.criancas}\n\n*📋 ITENS:* \n`;

        resultados.forEach(r => {
            if (r.subtipo !== 'observacao') texto += `• ${r.nome}: ${r.quantidade}\n`;
        });

        const linkFinal = `https://api.whatsapp.com/send/?text=${encodeURIComponent(texto)}`;
        window.open(linkFinal, '_blank');
    };

    const ColunaCarne = (sub) => (
        <div key={sub} style={styles.carneColumn}>
            <strong style={styles.cardOutrosTitle}>{EMOJIS[sub]} {sub.toUpperCase()}</strong>
            {opcoes.carnes
                .filter(c => c.subcategoria === sub && c.ativo)
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .map(c => (
                    <div key={c.id} style={styles.checkboxRow}>
                        <input type="checkbox" id={`it-${c.id}`} onChange={() => handleToggle(c.id)} />
                        <label htmlFor={`it-${c.id}`} style={styles.labelItem}>{c.nome}</label>
                    </div>
                ))}
        </div>
    );

    return (
        <div style={styles.mainContainer}>
            <button onClick={() => setAjudaAberta(true)} style={styles.helpBtn} title="Dicas">❓</button>

            {ajudaAberta && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitleRed}>{dados.dicasTitulo || '💡 Dicas de Mestre'}</h3>
                        <ul
                            style={styles.helpList} 
                            className="html-content"
                            dangerouslySetInnerHTML={{ __html: dados.dicasTexto || '<li><strong>Participantes:</strong> O cálculo muda se você informar mais homens, mulheres ou crianças.</li><li><strong>Bebem Álcool:</strong> O cálculo de bebidas alcoólicas considera uma margem de segurança para que a festa não acabe cedo demais.</li><li><strong>Variedade vs. Quantidade:</strong> Quanto mais tipos de carne você selecionar, menor será a quantidade de cada uma, mas o peso total total será mantido para evitar desperdício.</li><li><strong>Duração:</strong> Eventos com mais de 4h recebem uma margem de segurança extra.</li><li><strong>WhatsApp:</strong> Use a mensagem do WhatsApp como um checklist no supermercado, marcando o que já foi colocado no carrinho!</li>'}}
                        />
                        <button onClick={() => setAjudaAberta(false)} style={styles.closeBtn}>ENTENDI!</button>
                    </div>
                </div>
            )}

            <div style={styles.gridPessoas}>
                {['homens', 'mulheres', 'adultosQueBebem', 'criancas', 'horas'].map(campo => (
                    <div key={campo}>
                        <label style={styles.labelBold}>
                            {campo === 'adultosQueBebem' ? '🍺 Bebem' : campo.charAt(0).toUpperCase() + campo.slice(1)}
                        </label>
                        <input 
                            type="number" 
                            min="0" 
                            value={pessoas[campo]} 
                            style={styles.inputNumber}
                            onChange={e => {
                                let val = parseInt(e.target.value) || 0;
                                if (campo === 'adultosQueBebem') val = Math.min(val, pessoas.homens + pessoas.mulheres);
                                setPessoas({ ...pessoas, [campo]: val });
                            }} 
                        />
                    </div>
                ))}
            </div>

            <section>
                <h3>Selecione as Carnes</h3>
                <div style={styles.flexWrapGap}>
                    {['Bovina', 'Suína', 'Frango', 'Linguiça', 'Outras'].map(s => ColunaCarne(s))}
                </div>
            </section>

            <h3>Outros Itens</h3>
            <div style={styles.gridOutros}>
                {['bebidas', 'adicionais', 'acompanhamentos', 'utensilios'].map(cat => (
                    <div key={cat} style={styles.cardOutros}>
                        <strong style={styles.cardOutrosTitle}>{EMOJIS[cat]} {cat}</strong>
                        {opcoes[cat].filter(i => i.ativo).map(i => (
                            <div key={i.id} style={styles.checkboxRowCentered}>
                                <input type="checkbox" id={`it-${i.id}`} onChange={() => handleToggle(i.id)} />
                                <label htmlFor={`it-${i.id}`} style={styles.labelItem}>{i.nome}</label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button onClick={calcular} style={styles.btnCalcular}>
                📑 GERAR LISTA DE COMPRAS
            </button>

            {modalAberto && (
                <ModalResultado 
                    resultado={resultado} pessoas={pessoas} 
                    enviarWhatsApp={enviarWhatsApp} fechar={() => setModalAberto(false)} 
                    styles={styles}
                    modalStyles={modalStyles}
                />
            )}
        </div>
    );
}

function ModalResultado({ resultado, pessoas, enviarWhatsApp, fechar, styles, modalStyles }) {
    return (
        <div style={styles.modalFullOverlay}>
            <div style={styles.modalResultContent}>
                <h2 style={styles.modalTitleRed}>📋 Lista Gerada</h2>
                <div style={styles.infoBox}>
                    🧔 {pessoas.homens} | 👩 {pessoas.mulheres} | 👶 {pessoas.criancas} | ⏱️ {pessoas.horas}h
                </div>
                <button onClick={() => enviarWhatsApp(pessoas, resultado)} style={styles.btnWhatsapp}>
                    📱 Enviar para WhatsApp
                </button>
                <hr />
                {['comida', 'bebida', 'outros'].map(tipo => (
                    <div key={tipo} style={{ marginBottom: '20px' }}>
                        <h4 style={styles.tipoTitle}>{tipo}</h4>
                        {resultado.filter(r => r.tipo === tipo).map((r, i) => (
                            <div key={i} style={styles.itemResultRow}>
                                <span style={r.subtipo === 'observacao' ? styles.textObs : styles.textItem}>
                                    {r.nome}
                                </span>
                                <strong style={r.subtipo === 'observacao' ? styles.textObs : styles.textItem}>
                                    {r.quantidade}
                                </strong>
                            </div>
                        ))}
                    </div>
                ))}
                <button onClick={fechar} style={styles.btnCloseGray}>FECHAR</button>
            </div>
        </div>
    );
}