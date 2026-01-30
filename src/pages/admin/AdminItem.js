import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminItem({ opcoes, setOpcoes, styles, adminStyles }) {
    const [novoItem, setNovoItem] = useState({ 
        nome: '', 
        subcategoria: 'Bovina', 
        categoria: 'carnes' 
    });
    
    const [mensagem, setMensagem] = useState('');

    if (!opcoes || Object.keys(opcoes).length === 0) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-gray-50 font-sans">
                {/* Ícone ou Logo Animado */}
                <div className="text-[50px] mb-5 animate-pulse">
                    🔥
                </div>

                {/* Texto de Carregamento */}
                <h2 className="text-red-600 mb-2.5 font-bold text-xl">
                    Preparando a brasa...
                </h2>
                
                <p className="text-gray-500 text-sm">
                    Carregando Configurações
                </p>
            </div>
        );
    }

    const salvarNoServidor = async (dadosParaSalvar) => {
        try {
            const res = await fetch(`${API_URL}/admin/opcao/salvar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaSalvar),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setOpcoes({...dadosParaSalvar});
                setMensagem('✅ Alterações salvas com sucesso!');
                setTimeout(() => setMensagem(''), 3000);
            }
        } catch (error) { 
            alert("Erro ao conectar com o servidor."); 
        }
    };

    const atualizarCampoItem = (categoria, id, campo, valor) => {
        const novosDados = { ...opcoes };
        const item = novosDados[categoria]?.find(i => i.id === id);
        if (!item) return;

        const camposNumericos = ['pesoRelativo', 'gramasPorAdulto', 'qtdPorAdulto', 'embalagem', 'fator'];
        item[campo] = camposNumericos.includes(campo) ? parseFloat(valor) || 0 : valor;
        setOpcoes(novosDados);
    };

    const adicionarItem = () => {
        if (!novoItem.nome) return alert("Digite o nome!");
        const novosDados = { ...opcoes };
        const todos = Object.keys(opcoes).filter(k => Array.isArray(opcoes[k])).flatMap(k => opcoes[k]);
        const novoId = todos.length > 0 ? Math.max(...todos.map(i => i.id)) + 1 : 1;
        
        const item = { id: novoId, nome: novoItem.nome, ativo: true };

        if (novoItem.categoria === 'carnes') {
            item.subcategoria = novoItem.subcategoria;
            item.pesoRelativo = 10;
        } else if (novoItem.categoria === 'bebidas') {
            item.subcategoria = novoItem.subcategoria;
            item.embalagem = 1000;
        } else if (novoItem.categoria === 'utensilios') {
            item.base = 'pessoa';
            item.fator = 1;
            item.unidade = 'un';
        } else if (novoItem.categoria === 'sobremesas') {
            item.gramasPorAdulto = 100;
            item.unidade = 'g';
        } else {
            item.gramasPorAdulto = 50;
            item.unidade = 'g';
        }

        if (!novosDados[novoItem.categoria]) {
            novosDados[novoItem.categoria] = [];
        }
        novosDados[novoItem.categoria].push(item);
        salvarNoServidor(novosDados);
        setNovoItem({ ...novoItem, nome: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {mensagem && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-[5000] animate-bounce">
                    {mensagem}
                </div>
            )}

            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        ⚙️
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-0 tracking-tight uppercase">
                            Itens e Cálculos
                        </h1>
                        <p className="text-1 text-orange-700 dark:text-orange-400 font-medium mt-0">
                            Configure gramaturas, carnes, bebidas e acompanhamentos do sistema.
                        </p>
                    </div>
                </div>
            </header>

            {/* SEÇÃO DE COTAS GERAIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-5 rounded-xl shadow-xl border-l-8 border-red-500 bg-white dark:bg-zinc-800 border">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-200 mb-3">🥩 Carne (Homem)</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="w-24 p-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none dark:bg-zinc-600 dark:text-white" 
                            value={opcoes.configuracoes?.gramasCarneAdulto || 0} 
                            onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneAdulto: parseInt(e.target.value) || 0}})} 
                        />
                        <span className="font-medium dark:text-white">g</span>
                    </div>
                    <p className="mt-3 text-xs dark:text-white">* Mulher: 75% | Criança: 45%</p>
                </div>
                
                <div className="p-5 rounded-xl shadow-xl border-l-8 border-green-500 bg-white dark:bg-zinc-800 dark:text-white border">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-200 mb-3">🥗 Acompanhamentos</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="w-24 p-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-400 outline-none dark:bg-zinc-600 dark:text-white" 
                            value={opcoes.configuracoes?.gramasOutrosAdulto || 0} 
                            onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasOutrosAdulto: parseInt(e.target.value) || 0}})} 
                        />
                        <span className="font-medium dark:text-white">g</span>
                    </div>
                    <p className="mt-3 text-xs dark:text-white italic">* Distribuído entre os itens.</p>
                </div>

                <div className="p-5 rounded-xl shadow-xl border-l-8 border-blue-500 bg-white dark:bg-zinc-800 dark:text-neutral-100 border">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-200 mb-3">🥤 Bebida Total</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            className="w-24 p-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none dark:bg-zinc-600 dark:text-white" 
                            value={opcoes.configuracoes?.mlBebidaAdulto || 0} 
                            onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, mlBebidaAdulto: parseInt(e.target.value) || 0}})} 
                        />
                        <span className="font-medium dark:text-white">ml</span>
                    </div>
                    <p className="mt-3 text-xs dark:text-white italic">* Sugestão de consumo por adulto.</p>
                </div>
            </div>

            {/* FORMULÁRIO DE ADIÇÃO */}
            <section className="bg-neutral-50 p-6 rounded-xl mb-10 dark:bg-zinc-800 dark:text-white border border-neutral-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-700 mb-4 dark:text-neutral-200">➕ Adicionar Novo Item</h3>
                <div className="flex flex-wrap gap-3">
                    <input 
                        placeholder="Nome do item (ex: Picanha)" 
                        className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-xl focus:bg-white outline-none transition-all dark:bg-zinc-600 dark:text-white"
                        value={novoItem.nome} 
                        onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} 
                    />
                    
                    <select 
                        className="p-3 border border-gray-300 rounded-xl bg-white outline-none cursor-pointer dark:bg-zinc-600 dark:text-white"
                        value={novoItem.categoria} 
                        onChange={e => {
                            const cat = e.target.value;
                            let sub = (cat === 'carnes') ? 'Bovina' : (cat === 'bebidas' ? 'Não Alcoólica' : '');
                            setNovoItem({ ...novoItem, category: cat, categoria: cat, subcategoria: sub });
                        }}
                    >
                        <option value="carnes">Carnes</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="adicionais">Adicionais</option>
                        <option value="acompanhamentos">Acompanhamentos</option>
                        <option value="sobremesas">Sobremesas</option>
                        <option value="utensilios">Utensílios</option>
                    </select>

                    {novoItem.categoria === 'carnes' && (
                        <select 
                            className="p-3 border border-gray-300 rounded-xl bg-white outline-none dark:bg-zinc-600 dark:text-white"
                            value={novoItem.subcategoria} 
                            onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})}
                        >
                            {['Bovina', 'Suína', 'Frango', 'Linguiças', 'Outras'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )}

                    {novoItem.categoria === 'bebidas' && (
                        <select 
                            className="p-3 border border-gray-300 rounded-xl bg-white outline-none"
                            value={novoItem.subcategoria} 
                            onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})}
                        >
                            <option value="Não Alcoólica">Não Alcoólica</option>
                            <option value="Alcoólica">Alcoólica</option>
                        </select>
                    )}

                    <button 
                        onClick={adicionarItem} 
                        className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        ADICIONAR
                    </button>
                </div>
            </section>

            {/* LISTAGEM DE ITENS POR CATEGORIA */}
            {Object.keys(opcoes).filter(k => Array.isArray(opcoes[k])).map(cat => (
                <div key={cat} className="p-4 rounded-xl mb-8 overflow-hidden shadow-xl dark:bg-zinc-800 dark:text-white border border-neutral-200 dark:border-zinc-800">
                    <h3 className="-mx-4 -mt-4 mb-4 px-5 py-3 text-sm font-black uppercase tracking-widest border-b 
                    bg-neutral-200 dark:bg-zinc-900 dark:text-white border border-neutral-200 dark:border-zinc-900">
                        {cat.toUpperCase()}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {opcoes[cat].sort((a, b) => a.nome.localeCompare(b.nome)).map(item => (
                            <div key={item.id} className="p-4 rounded-xl hover:shadow-xl transition-shadow
                            dark:bg-zinc-700 dark:text-white border border-neutral-200 dark:border-zinc-800">
                                <div className="flex justify-between items-start mb-4">
                                    <strong className="dark:text-white block truncate pr-2">{item.nome}</strong>
                                    <span className="shrink-0">
                                        {cat === 'carnes' && (
                                            <select 
                                                className="text-[11px] p-1 border rounded outline-none
                                                dark:bg-zinc-600 dark:text-white"
                                                value={item.subcategoria} 
                                                onChange={e => atualizarCampoItem(cat, item.id, 'subcategoria', e.target.value)}
                                            >
                                                {['Bovina', 'Suína', 'Frango', 'Linguiças', 'Outras'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        )}
                                        { cat === 'bebidas' && (
                                            <select 
                                                className="text-[11px] p-1 border border-gray-200 rounded outline-none
                                                dark:bg-zinc-600 dark:text-white"
                                                value={item.subcategoria} 
                                                onChange={e => atualizarCampoItem(cat, item.id, 'subcategoria', e.target.value)}
                                            >
                                                <option value="Não Alcoólica">Não Alcoólica</option>
                                                <option value="Alcoólica">Alcoólica</option>
                                            </select>
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end gap-2">
                                    {cat === 'carnes' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] dark:text-white font-bold uppercase">Peso Relativo:</label>
                                            <input 
                                                type="number" 
                                                className="w-20 p-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-300
                                                dark:bg-zinc-600 dark:text-white" 
                                                value={item.pesoRelativo} 
                                                onChange={e => atualizarCampoItem(cat, item.id, 'pesoRelativo', e.target.value)} 
                                            />
                                        </div>
                                    )}

                                    {cat === 'bebidas' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] dark:text-white font-bold uppercase">Embalagem:</label>
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    className="w-20 p-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-300
                                                    dark:bg-zinc-600 dark:text-white" 
                                                    value={item.embalagem} 
                                                    onChange={e => atualizarCampoItem(cat, item.id, 'embalagem', e.target.value)} 
                                                />
                                                <span className="text-xs dark:text-white">ml</span>
                                            </div>
                                        </div>
                                    )}

                                    {(cat === 'acompanhamentos' || cat === 'adicionais' || cat === 'sobremesas') && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] dark:text-white font-bold uppercase">Qtd por Adulto:</label>
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    className="w-20 p-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-green-300
                                                    dark:bg-zinc-600 dark:text-white" 
                                                    value={item.gramasPorAdulto || item.qtdPorAdulto} 
                                                    onChange={e => atualizarCampoItem(cat, item.id, item.gramasPorAdulto !== undefined ? 'gramasPorAdulto' : 'qtdPorAdulto', e.target.value)} 
                                                />
                                                <span className="text-xs text-gray-400"> {!item.unidade ? 'g' : item.unidade}</span>
                                            </div>
                                        </div>
                                    )}

                                    {cat === 'utensilios' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] dark:text-white font-bold uppercase">Fator:</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    step="0.1" 
                                                    className="w-16 p-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-300
                                                    dark:bg-zinc-600 dark:text-white" 
                                                    value={item.fator} 
                                                    onChange={e => atualizarCampoItem(cat, item.id, 'fator', e.target.value)} 
                                                />
                                                <select 
                                                    className="text-[11px] p-1.5 border border-gray-200 rounded bg-gray-50 outline-none dark:bg-zinc-600 dark:text-white"
                                                    value={item.base} 
                                                    onChange={e => atualizarCampoItem(cat, item.id, 'base', e.target.value)}
                                                >
                                                    <option value="pessoa">p/ Pessoa</option>
                                                    <option value="carne">p/ kg Carne</option>
                                                    <option value="fixo">Fixo</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <label className={`flex items-center gap-2 text-[10px] border rounded-xl px-2 py-1.5 cursor-pointer transition-colors ${item.ativo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                            <input 
                                                type="checkbox" 
                                                className="accent-green-600"
                                                checked={item.ativo || false} 
                                                onChange={() => {
                                                    const novos = { ...opcoes };
                                                    const target = novos[cat].find(x => x.id === item.id);
                                                    target.ativo = !target.ativo;
                                                    setOpcoes(novos);
                                                }} 
                                            /> 
                                            <strong className="uppercase">{item.ativo ? 'Ativo' : 'Inativo'}</strong>
                                        </label>
                                        
                                        <button 
                                            onClick={() => {if(window.confirm('Excluir item?')){ const n = {...opcoes}; n[cat] = n[cat].filter(x => x.id !== item.id); salvarNoServidor(n); }}}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors text-xs"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="fixed bottom-8 right-8 z-[1000]">
                <button 
                    onClick={() => salvarNoServidor(opcoes)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-4 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all active:scale-95"
                >
                    <span className="text-xl">💾</span> Salvar Alterações
                </button>
            </div>
        </div>
    );
}