import React, { useState, useEffect, memo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const API_URL = process.env.REACT_APP_API_URL;

const EditorItem = memo(({ value, onChange, height = '300px' }) => {
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setCarregado(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!carregado) return (
        <div style={{ height }} className="mb-5 bg-neutral-100 dark:bg-zinc-800 animate-pulse rounded-xl flex items-center justify-center text-neutral-400 font-bold">
            Carregando Editor...
        </div>
    );

    return (
        <div className="ckeditor-wrapper mb-10 overflow-hidden rounded-xl border border-neutral-200 dark:border-zinc-700"> 
            <CKEditor
                editor={ClassicEditor}
                data={value || ''}
                config={{
                    toolbar: [
                            'undo', 'redo',
                            '|',
                            'heading',
                            '|',
                            'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|',
                            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|',
                            'link', 'uploadImage', 'blockQuote', 'codeBlock',
                            '|',
                            'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    placeholder: 'Comece a escrever aqui...'
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            <style>{`
                .ck-editor__editable_inline {
                    min-height: ${height};
                }
                .ck.ck-editor__main>.ck-editor__editable {
                    background: transparent;
                }
            `}</style>
        </div>
    );
});

const TEMPLATE_INICIAL_MAPA = {
    botoes: [
        { id: 'acougue', label: 'Açougues', cor: '#FB6458', icone: '🥩', pinUrl: '', termo: 'açougue OR "casa de carnes"', ativo: true },
        { id: 'bebidas', label: 'Bebidas', cor: '#7eb9fc', icone: '🍺', pinUrl: '', termo: 'bebidas OR adega', ativo: true },
        { id: 'mercado', label: 'Mercados', cor: '#FC7E84', icone: '🛒', pinUrl: '', termo: 'supermercado OR mercado', ativo: true },
        { id: 'utensilio', label: 'Utensílios', cor: '#EDAF23', icone: '🔪', pinUrl: '', termo: 'churrasqueira OR "artigos para churrasco"', ativo: true },
        { id: 'parceiro', label: 'Patrocinado', cor: '#000000', icone: '⭐', pinUrl: '', termo: 'Swift', ativo: true },
        { id: 'extra', label: 'Extra', cor: '#555555', icone: '🏪', pinUrl: '', termo: 'conveniência', ativo: false }
    ]
};

export default function AdminConteudo({ conteudo, setConteudo, atualizarApp, styles, adminStyles }) {
    const [abaAtiva, setAbaAtiva] = useState('layout');
    const [mensagem, setMensagem] = useState('');
    const [ultimasLogos, setUltimasLogos] = useState([]);
    const [modalGaleria, setModalGaleria] = useState({ aberto: false, tipo: '', index: null });
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        setMontado(true);
    }, []);

    useEffect(() => {
        if (conteudo && (!conteudo.ondeComprar || !conteudo.ondeComprar.botoes || conteudo.ondeComprar.botoes.length === 0)) {
            setConteudo(prev => ({
                ...prev,
                ondeComprar: TEMPLATE_INICIAL_MAPA
            }));
        }
    }, [conteudo, setConteudo]);

    useEffect(() => {
        fetch(`${API_URL}/admin/listar-logos`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUltimasLogos(data))
            .catch(err => console.error("Erro ao carregar histórico", err));
    }, [conteudo?.logoUrl, abaAtiva]);

    if (!conteudo) return <div className="flex h-screen items-center justify-center font-black text-orange-700 animate-pulse uppercase tracking-tighter">Carregando configurações...</div>;

    const salvarDados = async () => {
        const limparProfundo = (obj) => {
            if (typeof obj === 'string') {
                return obj.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
            }
            if (Array.isArray(obj)) return obj.map(limparProfundo);
            if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj).map(([key, val]) => [key, limparProfundo(val)])
                );
            }
            return obj;
        };

        const conteudoLimpo = limparProfundo(conteudo);

        try {
            setMensagem('⏳ Salvando conteúdo...');
            const res = await fetch(`${API_URL}/admin/conteudo/salvar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conteudoLimpo),
                credentials: 'include'
            });

            const respostaJson = await res.json();
            if (res.ok && respostaJson.success) {
                setConteudo(respostaJson.data); 
                if (atualizarApp) atualizarApp(); 
                setMensagem('✅ Conteúdo atualizado!');
                setTimeout(() => setMensagem(''), 3000);
            }
        } catch (err) {
            console.error("Erro ao salvar:", err);
            setMensagem('❌ Erro de conexão.');
        }
    };

    const handleConfigChange = (aba, campo, valor) => {
        if (aba === 'layout' || aba === 'sobre' || aba === 'inicio') {
            setConteudo(prev => ({ ...prev, [campo]: valor }));
        } else {
            setConteudo(prev => ({
                ...prev,
                [aba]: { ...prev[aba], [campo]: valor }
            }));
        }
    };

    const handleListChange = (categoria, index, campo, valor) => {
        setConteudo(prev => {
            const listaAtual = prev[categoria]?.itens || [];
            const novaLista = [...listaAtual];
            novaLista[index] = { ...novaLista[index], [campo]: valor };
            return { ...prev, [categoria]: { ...prev[categoria], itens: novaLista } };
        });
    };

    const handleOndeComprarChange = (index, campo, valor) => {
        setConteudo(prev => {
            const atual = prev.ondeComprar?.botoes || TEMPLATE_INICIAL_MAPA.botoes;
            const novosBotoes = [...atual];
            novosBotoes[index] = { ...novosBotoes[index], [campo]: valor };
            return { ...prev, ondeComprar: { ...prev.ondeComprar, botoes: novosBotoes } };
        });
    };

    const fazerUploadImagem = async (arquivo, tipo, index = null) => {
        if (!arquivo) return;
        const formData = new FormData();
        formData.append('logo', arquivo);
        try {
            setMensagem('⏳ Enviando imagem...');
            const res = await fetch(`${API_URL}/admin/upload-logo`, { method: 'POST', body: formData, credentials: 'include' });
            const data = await res.json();
            if (res.ok) {
                if (tipo === 'layout') handleConfigChange('layout', 'logoUrl', data.url);
                else if (tipo === 'pin') handleOndeComprarChange(index, 'pinUrl', data.url);
                setMensagem('✅ Imagem enviada!');
            }
        } catch (err) { alert('Erro no upload'); }
    };

    const selecionarDaGaleria = (url) => {
        if (modalGaleria.tipo === 'layout') handleConfigChange('layout', 'logoUrl', url);
        else if (modalGaleria.tipo === 'pin') handleOndeComprarChange(modalGaleria.index, 'pinUrl', url);
        setModalGaleria({ aberto: false, tipo: '', index: null });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {mensagem && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl border border-white/10">
                    {mensagem}
                </div>
            )}
            
            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        📝
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight uppercase mb-0">
                            Conteúdo
                        </h1>
                        <p className="text-1 text-orange-700 dark:text-orange-400 font-medium mt-0">
                            Edite textos da home, gerencie dicas de preparo e receitas exclusivas
                        </p>
                    </div>
                </div>
            </header>

            <nav className="flex flex-wrap gap-2 mb-8 bg-neutral-100 dark:bg-zinc-900 p-2 rounded-xl">
                {['layout', 'inicio', 'sobre', 'ondeComprar', 'dicas', 'produtos', 'utensilios', 'receitas'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setAbaAtiva(tab)}
                        className={`px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                            abaAtiva === tab 
                            ? 'bg-orange-700 text-white shadow-xl scale-105' 
                            : 'bg-transparent text-neutral-500 hover:bg-neutral-200 dark:hover:bg-zinc-800'
                        }`}
                    >
                        {tab === 'ondeComprar' ? 'ONDE COMPRAR' : tab.toUpperCase()}
                    </button>
                ))}
            </nav>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ABA LAYOUT */}
                {abaAtiva === 'layout' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl border border-neutral-200 dark:border-zinc-800">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white mb-6 border-l-4 border-orange-700 pl-4">Configurações Gerais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Nome do Aplicativo</label>
                                    <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-4 focus:ring-2 focus:ring-orange-400 outline-none" value={conteudo.nomeApp || ''} onChange={e => handleConfigChange('layout', 'nomeApp', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Instagram</label>
                                    <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-4 focus:ring-2 focus:ring-orange-400 outline-none" value={conteudo.instagram || ''} onChange={e => handleConfigChange('layout', 'instagram', e.target.value)} placeholder="@usuario" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">E-mail de Contato</label>
                                    <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-4 focus:ring-2 focus:ring-orange-400 outline-none" value={conteudo.emailContato || ''} onChange={e => handleConfigChange('layout', 'emailContato', e.target.value)} placeholder="contato@email.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Limite de Consultas</label>
                                    <input type="number" className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-4 focus:ring-2 focus:ring-orange-400 outline-none" value={conteudo.limiteConsulta || ''} onChange={e => handleConfigChange('layout', 'limiteConsulta', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl border border-neutral-200 dark:border-zinc-800">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white mb-6 border-l-4 border-emerald-500 pl-4">Paleta de Cores</h3>
                                    {/* ignorar , 'secondary', 'success', 'danger', 'warning', 'info' */}
                                    {['primary'].map(key => (
                                        <div key={key} className="p-4 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">{key}</label>
                                            <div className="flex flex-col gap-2">
                                                <input type="color" value={conteudo[key] || '#cccccc'} onChange={e => handleConfigChange('layout', key, e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                                                <input type="text" value={conteudo[key] || '#cccccc'} onChange={e => handleConfigChange('layout', key, e.target.value)} className="w-full text-center font-mono text-xs font-bold bg-white dark:bg-zinc-800 rounded-xl p-1 border border-neutral-200 dark:border-zinc-700 outline-none" maxLength={7} />
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl border border-neutral-200 dark:border-zinc-800">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white mb-6 border-l-4 border-purple-500 pl-4">Logotipo Principal</h3>
                                <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="bg-white p-4 rounded-xl shadow-xl min-w-[120px]">
                                        <img src={conteudo.logoUrl ? `${API_URL}${conteudo.logoUrl}` : '/logos/logo.png'} alt="Logo" className="w-24 h-24 object-contain mx-auto" />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <input id="logo-do-site" type="file" accept="image/*" onChange={(e) => fazerUploadImagem(e.target.files[0], 'layout')} className="hidden" />
                                        <label htmlFor="logo-do-site" className="bg-orange-700 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl uppercase text-[10px] tracking-widest cursor-pointer transition-all">
                                            📤 Enviar Logo
                                        </label>
                                        <button onClick={() => setModalGaleria({ aberto: true, tipo: 'layout' })} className="bg-zinc-700 hover:bg-zinc-600 text-white font-black px-8 py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all">
                                            🖼️ Abrir Galeria
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA ONDE ENCONTRAR */}
                {abaAtiva === 'ondeComprar' && (
                    <div className="space-y-6">
                        <header className="flex justify-between items-center mb-6 px-4">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white border-b-4 border-orange-400 inline-block">{abaAtiva.toUpperCase()}</h3>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conteudo.ondeComprar?.botoes?.map((botao, index) => (
                                <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border-2 border-neutral-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group transition-all" style={{ borderLeftColor: botao.cor, borderLeftWidth: '8px' }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-5 h-5 rounded-xl border-neutral-200 text-orange-700 focus:ring-orange-400" checked={botao.ativo} onChange={(e) => handleOndeComprarChange(index, 'ativo', e.target.checked)} /> 
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${botao.ativo ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                                {botao.ativo ? 'Ativo no Mapa' : 'Desativado'}
                                            </span>
                                        </label>
                                        <input type="color" value={botao.cor} onChange={e => handleOndeComprarChange(index, 'cor', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white dark:border-zinc-800 shadow-xl" />
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block mb-1">Título do Botão</label>
                                            <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-3 text-sm outline-none" value={botao.label} onChange={e => handleOndeComprarChange(index, 'label', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block mb-1">Busca Google Maps</label>
                                            <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-bold p-3 text-sm outline-none" value={botao.termo} onChange={e => handleOndeComprarChange(index, 'termo', e.target.value)} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                                            <div className="text-center space-y-1">
                                                <span className="text-[9px] font-black text-neutral-400 uppercase block">Emoji</span>
                                                <input className="w-full text-center text-3xl bg-transparent border-none outline-none" value={botao.icone} onChange={e => handleOndeComprarChange(index, 'icone', e.target.value)} />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <span className="text-[9px] font-black text-neutral-400 uppercase block">Pin Custom</span>
                                                <div className="flex justify-center h-10 items-center">
                                                    {botao.pinUrl ? <img alt="PIN" src={`${API_URL}${botao.pinUrl}`} className="h-full object-contain" /> : <span className="text-neutral-300 text-xs">Nenhum</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <input id={`upload-pin-${index}`} type="file" accept="image/*" onChange={(e) => fazerUploadImagem(e.target.files[0], 'pin', index)} className="hidden" />
                                            <label htmlFor={`upload-pin-${index}`} className="bg-zinc-200 dark:bg-zinc-800 hover:bg-orange-700 hover:text-white text-neutral-600 dark:text-neutral-400 text-center py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter cursor-pointer transition-all">
                                                Upload
                                            </label>
                                            <button onClick={() => setModalGaleria({ aberto: true, tipo: 'pin', index })} className="bg-zinc-200 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-neutral-600 dark:text-neutral-400 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all">
                                                Galeria
                                            </button>
                                            <button onClick={() => handleOndeComprarChange(index, 'pinUrl', '')} className="bg-zinc-200 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-neutral-600 dark:text-neutral-400 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all">
                                                Limpar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* INICIO E SOBRE */}
                {(abaAtiva === 'inicio' || abaAtiva === 'sobre') && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl border border-neutral-200 dark:border-zinc-800 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white mb-8 border-l-4 border-orange-700 pl-4">{abaAtiva.toUpperCase()}</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block mb-2">Título Principal da Página</label>
                                <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-black p-5 text-xl outline-none focus:ring-2 focus:ring-orange-400" value={conteudo[`${abaAtiva}Titulo`] || ''} onChange={e => handleConfigChange(abaAtiva, `${abaAtiva}Titulo`, e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block mb-2">Conteúdo Rico (HTML)</label>
                                {montado && (
                                   <EditorItem 
                                        key={`editor-${abaAtiva}`}
                                        value={conteudo[`${abaAtiva}Texto`]} 
                                        onChange={(val) => handleConfigChange(abaAtiva, `${abaAtiva}Texto`, val)}
                                        height="400px"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* LISTAGENS (DICAS, PRODUTOS, ETC) */}
                {['dicas', 'produtos', 'receitas', 'utensilios'].includes(abaAtiva) && (
                    <div className="space-y-8">
                        <header className="flex justify-between items-center px-4">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white border-b-4 border-orange-400 inline-block">{abaAtiva.toUpperCase()}</h3>
                            <button 
                                onClick={() => {
                                    const campoTexto = abaAtiva === 'receitas' ? 'preparo' : 'texto';
                                    const novo = { titulo: 'Novo Item', [campoTexto]: '', icone: '🔥' };
                                    const lista = [...(conteudo[abaAtiva]?.itens || []), novo];
                                    setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: lista } }));
                                }}
                                className="bg-orange-700 hover:bg-orange-400 text-white font-black px-6 py-3 rounded-xl uppercase text-[10px] tracking-widest transition-all shadow-xl"
                            >
                                + Adicionar Item
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {conteudo[abaAtiva]?.itens?.map((item, index) => (
                                <div key={index} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border-2 border-neutral-200 dark:border-zinc-800 shadow-xl flex flex-col h-full">
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Título</label>
                                            <input className="w-full bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl font-black p-3 text-lg outline-none" value={item.titulo} onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} />
                                        </div>
                                        <div className="w-20">
                                            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Ícone</label>
                                            <input className="w-full text-center text-2xl bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl p-3 outline-none" value={item.icone} onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} />
                                        </div>
                                    </div>

                                    {abaAtiva === 'receitas' && (
                                        <div className="space-y-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl p-3 font-bold text-sm outline-none" placeholder="⏱️ Tempo (Ex: 40min)" value={item.tempo || ''} onChange={e => handleListChange(abaAtiva, index, 'tempo', e.target.value)} />
                                                <select className="bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl p-3 font-bold text-sm outline-none" value={item.nivel || 'Fácil'} onChange={e => handleListChange(abaAtiva, index, 'nivel', e.target.value)}>
                                                    <option value="Fácil">🟢 Fácil</option>
                                                    <option value="Médio">🟡 Médio</option>
                                                    <option value="Difícil">🔴 Difícil</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block mb-2">Ingredientes (Um por linha)</label>
                                                <textarea
                                                    rows="5" 
                                                    className="w-full bg-neutral-50 dark:bg-zinc-800/50 border-2 border-neutral-200 dark:border-zinc-800 rounded-xl p-4 font-medium text-sm outline-none focus:border-orange-400 transition-all" 
                                                    value={Array.isArray(item.ingredientes) ? item.ingredientes.join('\n') : item.ingredientes || ''} 
                                                    onChange={e => handleListChange(abaAtiva, index, 'ingredientes', e.target.value.split('\n'))} 
                                                />
                                            </div>
                                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 block">Modo de Preparo</label>
                                        </div>
                                    )}

                                    <div className="flex-1 min-h-[250px]">
                                        {montado && (
                                            <EditorItem 
                                                key={`editor-${abaAtiva}-${index}`}
                                                value={abaAtiva === 'receitas' ? item.preparo : item.texto}
                                                onChange={(val) => handleListChange(abaAtiva, index, abaAtiva === 'receitas' ? 'preparo' : 'texto', val)}
                                                height="200px"
                                            />
                                        )}
                                    </div>

                                    <button onClick={() => {
                                        if(window.confirm('Excluir item?')) {
                                            const nl = conteudo[abaAtiva].itens.filter((_, i) => i !== index);
                                            setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: nl } }));
                                        }
                                    }} className="mt-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-neutral-200 dark:border-zinc-800 text-neutral-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                                        🗑️ Remover {abaAtiva.slice(0, -1)}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* BOTÃO SALVAR FIXO */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <button onClick={salvarDados} className="bg-orange-700 hover:bg-orange-400 text-white font-black px-8 py-5 rounded-xl uppercase text-l 
                tracking-[0.2em] transition-all hover:scale-110 active:scale-95 flex items-center gap-3">

                    
                    <span className="text-lg">💾</span> Salvar Tudo
                </button>
            </div>

            {/* MODAL GALERIA */}
            {modalGaleria.aberto && (
                <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl border border-white/10">
                        <header className="p-8 border-b border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">🖼️ Biblioteca de Mídia</h2>
                                <p className="text-neutral-500 text-xs font-bold">Selecione uma imagem já enviada anteriormente</p>
                            </div>
                            <button onClick={() => setModalGaleria({ aberto: false })} className="bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 p-3 rounded-xl transition-all font-black">✕</button>
                        </header>
                        
                        <div className="p-8 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {ultimasLogos.length > 0 ? ultimasLogos.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square bg-neutral-50 dark:bg-zinc-800 rounded-xl border-2 border-transparent hover:border-orange-400 p-4 transition-all cursor-pointer" onClick={() => selecionarDaGaleria(img.url)}>
                                    <img src={`${API_URL}${img.url}`} alt="Thumb" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center font-bold text-neutral-400">Nenhuma imagem encontrada no histórico.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
