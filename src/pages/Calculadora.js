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
    'sobremesas': '🍰',
    'utensilios': '🍴'
};

export default function Calculadora({ dados, opcoes, styles, usuario }) {

    const [selecionados, setSelecionados] = useState([]);
    const [pessoas, setPessoas] = useState({ 
        homens: 0, mulheres: 0, criancas: 0, adultosQueBebem: 0, horas: 4 
    });
    const [resultado, setResultado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [ajudaAberta, setAjudaAberta] = useState(false);

    const [estimativa, setEstimativa] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(false);

    const obterEstimativaIA = async () => {
        if (!usuario) return alert("Você precisa estar logado!");
        
        setCarregandoIA(true);
        setEstimativa(null); // Limpa estimativa anterior
        
        try {
            const res = await fetch(`${API_URL}/api/estimativa-ia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itens: resultado }) // Enviamos o resultado do cálculo (nome e qtd)
            });
            
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setEstimativa(data);
        } catch (error) {
            alert("Erro ao gerar estimativa: " + error.message);
        } finally {
            setCarregandoIA(false);
        }
    };

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
                {['bebidas', 'adicionais', 'acompanhamentos', 'sobremesas', 'utensilios'].map(cat => (
                    <div key={cat} style={styles.cardOutros}>
                        <strong style={{...styles.cardOutrosTitle, fontSize: '0.8em'}}>{EMOJIS[cat]} {cat}</strong>
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
                    resultado={resultado} 
                    pessoas={pessoas} 
                    enviarWhatsApp={enviarWhatsApp} 
                    fechar={() => { setModalAberto(false); setEstimativa(null); }} 
                    styles={styles}
                    gerarEstimativaComIA={obterEstimativaIA} // Passa a função real
                    usuario={usuario}
                    estimativa={estimativa} // Passa o estado da estimativa
                    carregandoIA={carregandoIA} // Passa o estado de loading
                />
            )}
        </div>
    );
}

function ModalResultado({ resultado, pessoas, enviarWhatsApp, fechar, styles, gerarEstimativaComIA, usuario, estimativa, carregandoIA }) {
    return (
        <div style={styles.modalFullOverlay}>
            <div style={styles.modalResultContent}>
                <h2 style={styles.modalTitleRed}>📋 Lista Gerada</h2>
                
                <div style={styles.infoBox}>
                    🧔 {pessoas.homens} | 👩 {pessoas.mulheres} | 👶 {pessoas.criancas} | ⏱️ {pessoas.horas}h
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={usuario ? () => enviarWhatsApp(pessoas, resultado) : undefined}
                        disabled={!usuario}
                        style={
                            {
                                ...styles.btnWhatsapp, 
                                flex: 1,
                                backgroundColor: usuario ? '#339944' : '#ccc',
                                cursor: (usuario) ? 'pointer' : 'not-allowed',
                            }
                        }>
                        📱 Enviar Lista por WhatsApp
                    </button>
                    
                    {/* Botão Gemini com trava de Login */}
                    <button 
                        onClick={gerarEstimativaComIA} 
                        disabled={!usuario || carregandoIA}
                        style={
                            {
                                ...styles.btnWhatsapp,
                                flex: 1,
                                backgroundColor: usuario ? '#007bff' : '#ccc',
                                cursor: (usuario && !carregandoIA) ? 'pointer' : 'not-allowed',
                            }
                        }
                    >
                        {carregandoIA ? "⏳ Calculando..." : "💰 Estimativa de Custo por IA"}
                    </button>
                    { !usuario ? <div style={{ 
                            width: '100%', 
                            backgroundColor: '#fff3cd', // Amarelo alerta suave
                            color: '#856404',           // Marrom texto de alerta
                            padding: '10px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            textAlign: 'center',
                            border: '1px solid #ffeeba',
                            marginTop: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <span>⚠️</span>
                            <span>Faça <strong>login</strong> para liberar o envio e a estimativa de custos.</span>
                        </div> : "" }
                </div>

                {/* Exibição da Estimativa do Gemini */}
                {estimativa && (
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        borderLeft: '5px solid #28a745'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>💰 Custos Estimados (IA)</h4>
                        {estimativa.grupos.map((g, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span>{g.nome}:</span>
                                <strong>R$ {g.valor.toFixed(2)}</strong>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                            <strong>TOTAL ESTIMADO:</strong>
                            <strong style={{ color: '#d9534f', fontSize: '18px' }}>R$ {estimativa.total.toFixed(2)}</strong>
                        </div>
                        {estimativa.observacao && (
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
                                💡 {estimativa.observacao}
                            </p>
                        )}
                    </div>
                )}

                <hr />
                
                {['comida', 'bebida', 'acompanhamentos', 'sobremesas', 'outros'].map(tipo => (
                    <div key={tipo} style={{ marginBottom: '20px' }}>
                        <h4 style={styles.tipoTitle}>{tipo.toUpperCase()}</h4>
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