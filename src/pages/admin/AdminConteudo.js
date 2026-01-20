import React, { useState, useEffect, useMemo, memo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = process.env.REACT_APP_API_URL;

// --- COMPONENTE DE EDITOR ISOLADO (CORREÇÃO PARA REACT 19) ---
const EditorItem = memo(({ value, onChange, modules, formats, height = '200px' }) => {
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setCarregado(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!carregado) return <div style={{ height, marginBottom: '75px', background: '#eee' }}>Carregando...</div>;

    return (
        <div className="quill-wrapper"> 
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                style={{ height, marginBottom: '75px' }}
            />
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

const QUILL_FORMATS = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'link', 'image'
];

export default function AdminConteudo({ conteudo, setConteudo, atualizarApp, styles, adminStyles }) {
    const [abaAtiva, setAbaAtiva] = useState('layout');
    const [mensagem, setMensagem] = useState('');
    const [ultimasLogos, setUltimasLogos] = useState([]);
    const [modalGaleria, setModalGaleria] = useState({ aberto: false, tipo: '', index: null });
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        setMontado(true);
    }, []);

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    }), []);

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

    if (!conteudo) return <div style={adminStyles.loading}>Carregando configurações...</div>;

    const salvarDados = async () => {
    // Função para limpar recursivamente &nbsp; de qualquer string dentro de um objeto ou array
        const limparProfundo = (obj) => {
            if (typeof obj === 'string') {
                return obj.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
            }
            if (Array.isArray(obj)) {
                return obj.map(limparProfundo);
            }
            if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj).map(([key, val]) => [key, limparProfundo(val)])
                );
            }
            return obj;
        };

        const conteudoLimpo = limparProfundo(conteudo);

        try {
            setMensagem('⏳ Salvando conteúdo limpo...');
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
                setMensagem('✅ Conteúdo atualizado e limpo!');
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

    const handleOndeComprarChange = (index, campo, valor) => {
        setConteudo(prev => {
            const atual = prev.ondeComprar?.botoes || TEMPLATE_INICIAL_MAPA.botoes;
            const novosBotoes = [...atual];
            novosBotoes[index] = { ...novosBotoes[index], [campo]: valor };
            return { ...prev, ondeComprar: { ...prev.ondeComprar, botoes: novosBotoes } };
        });
    };

    const handleListChange = (categoria, index, campo, valor) => {
        setConteudo(prev => {
            // 1. Pegamos a lista da categoria específica (ex: 'dicas')
            const listaAtual = prev[categoria]?.itens || [];
            
            // 2. Criamos uma cópia da lista
            const novaLista = [...listaAtual];

            // 3. Criamos uma cópia do ITEM específico que está sendo editado
            // Isso impede que a edição de um item afete outros que compartilham a mesma referência
            novaLista[index] = { 
                ...novaLista[index], 
                [campo]: valor 
            };

            // 4. Retornamos o novo estado preservando todo o resto
            return { 
                ...prev, 
                [categoria]: { 
                    ...prev[categoria], 
                    itens: novaLista 
                } 
            };
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

    const responsiveGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '15px'
    };

    const colorGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '25px',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '12px'
    };

    return (
        <div style={{ ...styles.container, paddingBottom: '100px' }}>
            <style>{`
                @media (max-width: 600px) {
                    .admin-tab-bar { display: flex; overflow-x: auto; white-space: nowrap; padding-bottom: 10px; }
                    .admin-tab-bar button { flex: 0 0 auto; }
                    .logo-grid { grid-template-columns: 1fr !important; text-align: center; }
                    .pin-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {mensagem && <div style={adminStyles.msgStyle}>{mensagem}</div>}
            
            <header style={adminStyles.headerRow}>
                <h1 style={styles.title}>📝 Gerenciar Conteúdo</h1>
                <p style={styles.subtitle}>Configure textos, cores e os botões do mapa</p>
            </header>

            <div className="admin-tab-bar" style={{ ...adminStyles.tabBar, flexWrap: 'wrap' }}>
                {['layout', 'inicio', 'sobre', 'ondeComprar', 'dicas', 'produtos', 'utensilios', 'receitas'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setAbaAtiva(tab)}
                        style={{
                            ...adminStyles.tabBtn, 
                            ...(abaAtiva === tab ? adminStyles.statusAtivo : adminStyles.statusInativo),
                            margin: '4px'
                        }}
                    >
                        {tab === 'ondeComprar' ? 'ONDE COMPRAR' : tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={styles.contentWrapper}>
                {/* ABA LAYOUT */}
                {abaAtiva === 'layout' && (
                    <div style={styles.column}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '13px 0'}}>
                            <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={adminStyles.label}>Nome do Aplicativo:</label>
                                <input style={adminStyles.input} value={conteudo.nomeApp || ''} onChange={e => handleConfigChange('layout', 'nomeApp', e.target.value)} />
                            </div>
                            <div>
                                <label style={adminStyles.label}>Instagram:</label>
                                <input style={adminStyles.input} value={conteudo.instagram || ''} onChange={e => handleConfigChange('layout', 'instagram', e.target.value)} placeholder="@usuario" />
                            </div>
                            <div>
                                <label style={adminStyles.label}>E-mail de Contato:</label>
                                <input style={adminStyles.input} value={conteudo.emailContato || ''} onChange={e => handleConfigChange('layout', 'emailContato', e.target.value)} placeholder="contato@email.com" />
                            </div>
                            <div>
                                <label style={adminStyles.label}>Limite de Consultas:</label>
                                <input type="number" style={adminStyles.numInput} value={conteudo.limiteConsulta || ''} onChange={e => handleConfigChange('layout', 'limiteConsulta', e.target.value)} />
                            </div>
                        </div>

                        <h3 style={styles.cardHeaderTitle}>Paleta de Cores</h3>
                        <div style={{...colorGrid,  border: '1px solid #eee'}}>
                            {['primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(key => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ ...adminStyles.label, marginBottom: 0 }}>{key.toUpperCase()}:</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input type="color" value={conteudo[key] || '#cccccc'} onChange={e => handleConfigChange('layout', key, e.target.value)} style={{ width: '40px', height: '38px', padding: '2px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px' }} />
                                        <input type="text" value={conteudo[key] || '#cccccc'} onChange={e => handleConfigChange('layout', key, e.target.value)} style={{ ...adminStyles.input, flex: 1, fontFamily: 'monospace', textAlign: 'center' }} maxLength={7} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={{...styles.cardHeaderTitle, margin: '30px 0 0'}}>Logotipo Principal</h3>
                        <div className="logo-grid" style={{ ...colorGrid, display: 'grid', gridTemplateColumns: '120px 1fr 1fr', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={conteudo.logoUrl ? `${API_URL}${conteudo.logoUrl}` : '/logos/logo.png'} alt="Logo" style={{ ...styles.logoPreview, margin: '0 auto', width: '100px', height: '100px', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <input id="logo-do-site" type="file" accept="image/*" onChange={(e) => fazerUploadImagem(e.target.files[0], 'layout')} style={{ display: 'none' }} />
                                <label htmlFor="logo-do-site" style={{ ...adminStyles.addBtn, 
                                    display: 'block', textAlign: 'center', cursor: 'pointer', padding: '10px 20px', fontSize: '14px'  }}>
                                    📤 Enviar
                                </label>
                            </div>
                            <button onClick={() => setModalGaleria({ aberto: true, tipo: 'layout' })} style={{ ...adminStyles.addBtn, 
                                display: 'block', textAlign: 'center', cursor: 'pointer', padding: '13px 20px', fontSize: '14px',
                                backgroundColor: '#555' }}>
                                    🖼️ Galeria
                            </button>
                        </div>
                    </div>
                )}

                {/* ABA ONDE ENCONTRAR */}
                {abaAtiva === 'ondeComprar' && (
                    <div style={styles.column}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '13px 0'}}>
                            <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                        </div>
                        <div style={responsiveGrid}>
                            {conteudo.ondeComprar?.botoes?.map((botao, index) => (
                                <div key={index} style={{ ...adminStyles.cardBox, borderLeft: `5px solid ${botao.cor}`, margin: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" checked={botao.ativo} onChange={(e) => handleOndeComprarChange(index, 'ativo', e.target.checked)} /> 
                                            <strong>{botao.ativo ? 'Ativo' : 'Inativo'}</strong>
                                        </label>
                                        <input type="color" value={botao.cor} onChange={e => handleOndeComprarChange(index, 'cor', e.target.value)} style={{ width: '30px', height: '30px', border: 'none', cursor: 'pointer' }} />
                                    </div>
                                    <label style={adminStyles.label}>Título:</label>
                                    <input style={{ ...adminStyles.input, marginBottom: '10px' }} value={botao.label} onChange={e => handleOndeComprarChange(index, 'label', e.target.value)} />
                                    <label style={adminStyles.label}>Busca Maps:</label>
                                    <input style={{ ...adminStyles.input, marginBottom: '10px' }} value={botao.termo} onChange={e => handleOndeComprarChange(index, 'termo', e.target.value)} />
                                    
                                    <div className="pin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', background: '#fff', padding: '10px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '10px', display: 'block' }}>EMOJI</span>
                                                <input style={{ width: '100%', textAlign: 'center', fontSize: '30px', border: '0px solid #eee', background: 'transparent' }} value={botao.icone} onChange={e => handleOndeComprarChange(index, 'icone', e.target.value)} />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '10px', display: 'block' }}>PIN</span>
                                                {botao.pinUrl ? <img alt="PIN" src={`${API_URL}${botao.pinUrl}`} style={{ width: '45px', height: '45px', objectFit: 'contain' }} /> : <span>-</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <div>
                                                <input 
                                                    id={`upload-pin-${index}`}
                                                    type="file" accept="image/*" onChange={(e) => fazerUploadImagem(e.target.files[0], 'pin', index)} style={{ display: 'none' }} />
                                                <label htmlFor={`upload-pin-${index}`} style={{ ...adminStyles.addBtn, 
                                                    display: 'block', textAlign: 'center', cursor: 'pointer', padding: '8px 20px', fontSize: '13px'  }}>
                                                    📤 Enviar
                                                </label>
                                            </div>
                                            <button onClick={() => setModalGaleria({ aberto: true, tipo: 'pin', index })} style={{ ...adminStyles.addBtn, 
                                                display: 'block', textAlign: 'center', cursor: 'pointer', padding: '11px 20px', fontSize: '13px',
                                                backgroundColor: '#555' }}>
                                                    🖼️ Galeria
                                            </button>
                                            <button 
                                                onClick={() => handleOndeComprarChange(index, 'pinUrl', '')} 
                                                style={{ ...adminStyles.addBtn, 
                                                display: 'block', textAlign: 'center', cursor: 'pointer', padding: '11px 20px', fontSize: '13px',
                                                backgroundColor: '#ff5555' }}>
                                                    🗑️ Limpar
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
                    <div style={styles.column}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '13px 0'}}>
                            <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                        </div>
                        <div>
                            <label style={{...adminStyles.label, marginTop: '15px'}}>Título da Página:</label>
                            <input style={{ ...adminStyles.input, marginBottom: '15px' }} value={conteudo[`${abaAtiva}Titulo`] || ''} onChange={e => handleConfigChange(abaAtiva, `${abaAtiva}Titulo`, e.target.value)} />
                            {montado && (
                                <EditorItem 
                                    key={`editor-${abaAtiva}`}
                                    value={conteudo[`${abaAtiva}Texto`]} 
                                    onChange={(val) => handleConfigChange(abaAtiva, `${abaAtiva}Texto`, val)}
                                    modules={modules}
                                    formats={QUILL_FORMATS}
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* LISTAGENS (DICAS, PRODUTOS, ETC) */}
                {['dicas', 'produtos', 'receitas', 'utensilios'].includes(abaAtiva) && (
                    <div style={styles.column}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                            <button 
                                onClick={() => {
                                    const campoTexto = abaAtiva === 'receitas' ? 'preparo' : 'texto';
                                    const novo = { titulo: 'Novo Item', [campoTexto]: '', icone: '🔥' };
                                    const lista = [...(conteudo[abaAtiva]?.itens || []), novo];
                                    setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: lista } }));
                                }}
                                style={adminStyles.addBtn}
                            >
                                + Adicionar
                            </button>
                        </div>
                        <div style={responsiveGrid}>
                            {conteudo[abaAtiva]?.itens?.map((item, index) => (
                                <div key={index} style={adminStyles.cardBox}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input style={{ ...adminStyles.input, flex: 4 }} value={item.titulo} onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} />
                                        <input style={{ ...adminStyles.input, flex: 1, textAlign: 'center' }} value={item.icone} onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} />
                                    </div>
                                    {abaAtiva === 'receitas' && (
                                        <>
                                            <div style={adminStyles.recipeGrid}>
                                                    <input style={adminStyles.input} placeholder="Tempo" value={item.tempo || ''} onChange={e => handleListChange(abaAtiva, index, 'tempo', e.target.value)} />
                                                    <select style={adminStyles.input} value={item.nivel || 'Fácil'} onChange={e => handleListChange(abaAtiva, index, 'nivel', e.target.value)}>
                                                        <option value="Fácil">Fácil</option>
                                                        <option value="Médio">Médio</option>
                                                        <option value="Difícil">Difícil</option>
                                                    </select>
                                                </div>
                                                <label style={adminStyles.label}>Ingredientes:</label>
                                                <textarea
                                                    rows="8" 
                                                    style={adminStyles.textarea} 
                                                    value={Array.isArray(item.ingredientes) ? item.ingredientes.join('\n') : item.ingredientes || ''} 
                                                    onChange={e => handleListChange(abaAtiva, index, 'ingredientes', e.target.value.split('\n'))} 
                                                />
                                                <label style={adminStyles.label}>Modo de Preparo:</label>
                                        </>
                                    )}
                                    <div style={{backgroundColor: '#fff', padding: '0px'}}>
                                        {montado && (
                                            <EditorItem 
                                                key={`editor-${abaAtiva}-${index}`}
                                                value={abaAtiva === 'receitas' ? item.preparo : item.texto}
                                                onChange={(val) => handleListChange(abaAtiva, index, abaAtiva === 'receitas' ? 'preparo' : 'texto', val)}
                                                modules={modules}
                                                formats={QUILL_FORMATS}
                                            />
                                        )}
                                    </div>
                                    <button onClick={() => {
                                        const nl = conteudo[abaAtiva].itens.filter((_, i) => i !== index);
                                        setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: nl } }));
                                    }} style={{ ...adminStyles.deleteBtn, marginTop: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>🗑️ Remover</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ position: 'sticky', bottom: '20px', textAlign: 'right', marginRight: '20px', zIndex: 1000 }}>
                <button onClick={salvarDados} style={{ ...adminStyles.saveBtn, backgroundColor: '#2299FF', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>💾 Salvar Alterações</button>
            </div>

            {/* MODAL GALERIA */}
            {modalGaleria.aberto && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '15px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>🖼️ Biblioteca</h2>
                            <button onClick={() => setModalGaleria({ aberto: false })} style={{ border: 'none', background: '#eee', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                            {ultimasLogos.map((img, idx) => (
                                <img key={idx} src={`${API_URL}${img.url}`} alt="Thumb" onClick={() => selecionarDaGaleria(img.url)} style={{ width: '100%', height: '100px', objectFit: 'contain', cursor: 'pointer', border: '1px solid #eee', borderRadius: '8px' }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}