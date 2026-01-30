import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

marked.setOptions({
    breaks: true, 
    gfm: true
});

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

const formatarMarkdown = (texto) => {
    if (!texto) return '';
    let textoFormatado = texto.replace(/--- (.*?) ---/g, '### $1');
    return marked.parse(textoFormatado);
};

export default function Calculadora({ dados, opcoes, usuario }) {
    const [selecionados, setSelecionados] = useState([]);
    const [pessoas, setPessoas] = useState({ 
        homens: 0, mulheres: 0, criancas: 0, adultosQueBebem: 0, horas: 4 
    });
    const [resultado, setResultado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [ajudaAberta, setAjudaAberta] = useState(false);
    const [estimativa, setEstimativa] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(false);

    const navigate = useNavigate();

    const obterEstimativaIA = async () => {
        if (!usuario) return alert("Você precisa estar logado!");
        setCarregandoIA(true);
        setEstimativa(null);
        try {
            const res = await fetch(`${API_URL}/api/estimativa-ia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itens: resultado })
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
        try {
            const res = await fetch(`${API_URL}/api/calcular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...pessoas, selecionados })
            });
            const data = await res.json();
            if (res.status === 403 && data.limiteAtingido) {
                navigate('/login', { state: { mensagem: "Atingiu o limite" } });
                return;
            }
            if (!res.ok) throw new Error(data.message || "Erro ao calcular");
            setResultado(data);
            setModalAberto(true);
        } catch (error) {
            alert("Erro na conexão: " + error.message);
        }
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
        <div key={sub} className="bg-white dark:bg-zinc-800 p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl flex-1 min-w-[200px]">
            <strong className="block text-sm font-black text-orange-700 dark:text-orange-400 mb-4 uppercase tracking-wider">
                {EMOJIS[sub]} {sub}
            </strong>
            <div className="space-y-3">
                {opcoes.carnes
                    .filter(c => c.subcategoria === sub && c.ativo)
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map(c => (
                        <div key={c.id} className="flex items-center group cursor-pointer">
                            <input 
                                type="checkbox" 
                                id={`it-${c.id}`} 
                                className="w-5 h-5 rounded border-neutral-200 text-orange-700 focus:ring-orange-400 cursor-pointer"
                                onChange={() => handleToggle(c.id)} 
                            />
                            <label htmlFor={`it-${c.id}`} className="ml-3 text-sm font-medium text-neutral-700 dark:text-zinc-300 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors cursor-pointer">
                                {c.nome}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-10 transition-colors duration-300">
                {/* Botão de Ajuda */}
                <button 
                    onClick={() => setAjudaAberta(true)} 
                    className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-orange-700 hover:bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all font-black shadow-xl"
                >
                    ?
                </button>

                {/* Modal de Ajuda */}
                {ajudaAberta && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl p-8 shadow-xl border border-neutral-200 dark:border-zinc-800">
                            <h3 className="text-2xl font-black text-red-600 dark:text-red-500 mb-6 uppercase">
                                {dados.dicasTitulo || '💡 Dicas de Mestre'}
                            </h3>
                            <div 
                                className="prose prose-sm dark:prose-invert max-w-none mb-8"
                                dangerouslySetInnerHTML={{ __html: dados.dicasTexto || '...' }}
                            />
                            <button 
                                onClick={() => setAjudaAberta(false)} 
                                className="w-full bg-neutral-900 dark:bg-orange-700 text-white font-black py-4 rounded-xl hover:bg-orange-700 dark:hover:bg-orange-400 hover:text-white transition-all"
                            >
                                ENTENDI!
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid de Participantes */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    {['homens', 'mulheres', 'adultosQueBebem', 'criancas', 'horas'].map(campo => (
                        <div key={campo} className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl">
                            <label className="block text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400 mb-2 tracking-widest">
                                {campo === 'criancas' ? '👶 Crianças' : (campo === 'adultosQueBebem' ? '🍺 Bebem' : campo === 'horas' ? '⏱️ Horas' : campo === 'homens' ? '🧔 Homens' : '👩 Mulheres')}
                            </label>
                            <input 
                                type="number" 
                                min="0" 
                                value={pessoas[campo]} 
                                className="w-full bg-neutral-50 dark:bg-zinc-700 border-none rounded-xl text-xl font-bold text-neutral-800 dark:text-white focus:ring-2 focus:ring-orange-400 px-6 py-2 text-center"
                                onChange={e => {
                                    let val = parseInt(e.target.value) || 0;
                                    if (campo === 'adultosQueBebem') val = Math.min(val, pessoas.homens + pessoas.mulheres);
                                    setPessoas({ ...pessoas, [campo]: val });
                                }} 
                            />
                        </div>
                    ))}
                </div>

                {/* Seleção de Carnes */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-neutral-800 dark:text-white mb-6 uppercase flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-700 rounded-xl flex items-center justify-center text-white text-sm">1</span>
                        Selecione as Carnes
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {['Bovina', 'Suína', 'Frango', 'Linguiça', 'Outras'].map(s => ColunaCarne(s))}
                    </div>
                </section>

                {/* Outros Itens */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-neutral-800 dark:text-white mb-6 uppercase flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-700 rounded-xl flex items-center justify-center text-white text-sm">2</span>
                        Outros Itens
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {['bebidas', 'adicionais', 'acompanhamentos', 'sobremesas', 'utensilios'].map(cat => (
                            <div key={cat} className="bg-neutral-50 dark:bg-zinc-800 p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl">
                                <strong className="block text-sm font-black text-neutral-400 dark:text-zinc-500 mb-4 uppercase tracking-tighter">
                                    {EMOJIS[cat]} {cat}
                                </strong>
                                <div className="space-y-3">
                                    {opcoes[cat].filter(i => i.ativo).map(i => (
                                        <div key={i.id} className="flex items-center group cursor-pointer">
                                            <input type="checkbox" id={`it-${i.id}`} className="w-4 h-4 rounded border-neutral-200 text-orange-700 focus:ring-orange-400" onChange={() => handleToggle(i.id)} />
                                            <label htmlFor={`it-${i.id}`} className="ml-2 text-xs font-bold text-neutral-600 dark:text-zinc-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors cursor-pointer">{i.nome}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <div className="mt-8 w-full flex justify-center">
                    <button 
                        onClick={calcular} 
                        className="w-full max-w-sm bg-orange-700 hover:bg-orange-400 text-white text-lg font-black py-5 rounded-xl transition-all shadow-xl hover:scale-110 active:scale-95 text-center no-underline"
                    >
                        📑 GERAR LISTA DE COMPRAS
                    </button>
                </div>

                {modalAberto && (
                    <ModalResultado 
                        resultado={resultado} 
                        pessoas={pessoas} 
                        enviarWhatsApp={enviarWhatsApp} 
                        fechar={() => { setModalAberto(false); setEstimativa(null); }} 
                        gerarEstimativaComIA={obterEstimativaIA}
                        usuario={usuario}
                        estimativa={estimativa}
                        carregandoIA={carregandoIA}
                    />
                )}
            </div>
        </div>
    );
}

function ModalResultado({ resultado, pessoas, enviarWhatsApp, fechar, gerarEstimativaComIA, usuario, estimativa, carregandoIA }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto md:rounded-2xl p-6 md:p-10 shadow-xl relative">
                
                <h2 className="text-3xl font-black text-red-600 dark:text-red-500 mb-6 uppercase tracking-tighter">📋 Lista Gerada</h2>
                
                <div className="bg-neutral-100 dark:bg-zinc-800 p-4 rounded-xl mb-8 flex justify-center gap-6 text-sm font-bold text-neutral-600 dark:text-zinc-300">
                    <span>🧔 {pessoas.homens}</span>
                    <span>👩 {pessoas.mulheres}</span>
                    <span>👶 {pessoas.criancas}</span>
                    <span>⏱️ {pessoas.horas}h</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={usuario ? () => enviarWhatsApp(pessoas, resultado) : undefined}
                        disabled={!usuario}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${usuario ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                    >
                        📱 WhatsApp
                    </button>
                    
                    <button 
                        onClick={gerarEstimativaComIA} 
                        disabled={!usuario || carregandoIA}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${usuario ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                    >
                        {carregandoIA ? "⏳ Calculando..." : "💰 Estimativa IA"}
                    </button>

                    {!usuario && (
                        <div className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-400 p-3 rounded-xl text-xs font-medium">
                            <span>⚠️</span>
                            <span>Faça login para liberar o envio e a estimativa de custos.</span>
                        </div>
                    )}
                </div>

                {estimativa && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl mb-8 border-l-8 border-green-500">
                        <h4 className="text-green-700 dark:text-green-400 font-black mb-4 uppercase text-sm tracking-widest">💰 Custos Estimados (IA)</h4>
                        <div className="space-y-2">
                            {estimativa.grupos.map((g, i) => (
                                <div key={i} className="flex justify-between text-sm text-neutral-600 dark:text-zinc-300">
                                    <span>{g.nome}:</span>
                                    <span className="font-bold">R$ {g.valor.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between mt-4 pt-4 border-t border-green-200 dark:border-green-800 font-black text-lg">
                                <span className="text-neutral-800 dark:text-white">TOTAL:</span>
                                <span className="text-red-600 dark:text-red-400 font-black">R$ {estimativa.total.toFixed(2)}</span>
                            </div>
                        </div>
                        {estimativa.observacao && (
                            <div 
                                className="mt-4 pt-4 border-t border-green-200 dark:border-green-800 prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: formatarMarkdown(estimativa.observacao) }} 
                            />
                        )}
                    </div>
                )}

                <div className="space-y-8 mb-10">
                    {['comida', 'bebida', 'acompanhamentos', 'sobremesas', 'outros'].map(tipo => {
                        const itens = resultado.filter(r => r.tipo === tipo);
                        if (itens.length === 0) return null;
                        return (
                            <div key={tipo}>
                                <h4 className="text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-[0.2em] mb-4 border-b border-orange-400 dark:border-orange-700/30 pb-2">{tipo}</h4>
                                <div className="space-y-1">
                                    {itens.map((r, i) => (
                                        <div 
                                            key={i} 
                                            className={`flex justify-between py-2 px-3 rounded-xl text-sm transition-colors ${r.subtipo === 'subtotal' ? 'bg-neutral-50 dark:bg-zinc-800/50 font-black text-neutral-900 dark:text-white mt-2' : r.subtipo === 'total_secao' ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-neutral-900 font-black mt-4' : 'text-neutral-600 dark:text-zinc-400'}`}
                                        >
                                            <span className={r.subtipo === 'observacao' ? 'text-xs opacity-75' : ''}>{r.nome}</span>
                                            <span className="font-mono">{r.quantidade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-amber-50 dark:bg-zinc-800 p-6 rounded-xl text-[10px] md:text-xs text-amber-800 dark:text-zinc-400 leading-relaxed mb-8 border border-amber-100 dark:border-zinc-700">
                    Os cálculos são recomendações baseadas em médias. As quantidades podem variar conforme o apetite dos convidados.
                </div>

                <button 
                    onClick={fechar} 
                    className="w-full bg-neutral-200 dark:bg-red-800 text-neutral-600 dark:text-zinc-300 font-black py-4 rounded-xl hover:bg-neutral-300 dark:hover:bg-orange-400 transition-all"
                >
                    FECHAR
                </button>
            </div>
        </div>
    );
}