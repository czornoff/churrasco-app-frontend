import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const API_URL = process.env.REACT_APP_API_URL;
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_KEY;

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

const TINYMCE_INIT = {
    menubar: false,
    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
};

export default function AdminConteudo({ conteudo, setConteudo, atualizarApp, styles, adminStyles }) {
    const [abaAtiva, setAbaAtiva] = useState('layout');
    const [mensagem, setMensagem] = useState('');
    const [ultimasLogos, setUltimasLogos] = useState([]);
    const [modalGaleria, setModalGaleria] = useState({ aberto: false, tipo: '', index: null });

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
        try {
            const res = await fetch(`${API_URL}/admin/conteudo/salvar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conteudo),
                credentials: 'include'
            });
            const respostaJson = await res.json();
            if (res.ok && respostaJson.success) {
                setConteudo(respostaJson.data); 
                if (atualizarApp) atualizarApp(); 
                setMensagem('✅ Conteúdo atualizado com sucesso!');
                setTimeout(() => setMensagem(''), 3000);
            }
        } catch (err) {
            console.error("Erro de conexão:", err);
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
        const novaLista = [...(conteudo[categoria]?.itens || [])];
        novaLista[index] = { ...novaLista[index], [campo]: valor };
        setConteudo(prev => ({ ...prev, [categoria]: { ...prev[categoria], itens: novaLista } }));
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

    // Estilos Inline Dinâmicos para Responsividade
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
            {/* CSS para ajustes finos de mobile */}
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
                {['layout', 'inicio', 'ondeComprar', 'sobre', 'dicas', 'produtos', 'utensilios', 'receitas'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setAbaAtiva(tab)}
                        style={{
                            ...adminStyles.tabBtn, 
                            ...(abaAtiva === tab ? adminStyles.statusAtivo : adminStyles.statusInativo),
                            margin: '4px'
                        }}
                    >
                        {tab === 'ondeComprar' ? 'ONDE ENCONTRAR' : tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={styles.contentWrapper}>
                
                {/* ABA LAYOUT */}
                {abaAtiva === 'layout' && (
                    <div style={styles.column}>
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
                                            <input style={{ width: '100%', textAlign: 'center', fontSize: '30px', border: '0px solid #eee' }} value={botao.icone} onChange={e => handleOndeComprarChange(index, 'icone', e.target.value)} />
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
                )}

                {/* INICIO E SOBRE */}
                {(abaAtiva === 'inicio' || abaAtiva === 'sobre') && (
                    <div style={styles.column}>
                        <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                        <label style={adminStyles.label}>Título da Página:</label>
                        <input style={{ ...adminStyles.input, marginBottom: '15px' }} value={conteudo[`${abaAtiva}Titulo`] || ''} onChange={e => handleConfigChange(abaAtiva, `${abaAtiva}Titulo`, e.target.value)} />
                        <Editor
                            apiKey={TINYMCE_API_KEY}
                            value={conteudo[`${abaAtiva}Texto`] || ''}
                            init={{ ...TINYMCE_INIT, height: 400 }}
                            onEditorChange={(novo) => handleConfigChange(abaAtiva, `${abaAtiva}Texto`, novo)}
                        />
                    </div>
                )}

                {/* LISTAGENS (DICAS, PRODUTOS, ETC) */}
                {['dicas', 'produtos', 'receitas', 'utensilios'].includes(abaAtiva) && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={styles.cardTitle}>{abaAtiva.toUpperCase()}</h3>
                            <button onClick={() => {
                                const novo = { titulo: 'Novo Item', texto: '', icone: '🔥' };
                                const lista = [...(conteudo[abaAtiva]?.itens || []), novo];
                                setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: lista } }));
                            }} style={adminStyles.addBtn}>+ Adicionar</button>
                        </div>
                        <div style={responsiveGrid}>
                            {conteudo[abaAtiva]?.itens?.map((item, index) => (
                                <div key={index} style={adminStyles.cardBox}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input style={{ ...adminStyles.input, flex: 4 }} value={item.titulo} onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} />
                                        <input style={{ ...adminStyles.input, flex: 1, textAlign: 'center' }} value={item.icone} onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} />
                                    </div>
                                    <Editor
                                        apiKey={TINYMCE_API_KEY}
                                        value={abaAtiva === 'receitas' ? item.preparo : item.texto || ''}
                                        init={{ ...TINYMCE_INIT, height: 200 }}
                                        onEditorChange={(n) => handleListChange(abaAtiva, index, abaAtiva === 'receitas' ? 'preparo' : 'texto', n)}
                                    />
                                    <button onClick={() => {
                                        const nl = conteudo[abaAtiva].itens.filter((_, i) => i !== index);
                                        setConteudo(prev => ({ ...prev, [abaAtiva]: { ...prev[abaAtiva], itens: nl } }));
                                    }} style={{ ...adminStyles.deleteBtn, marginTop: '10px', width: '100%' }}>🗑️ Remover</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ position: 'sticky', bottom: '20px', textAlign: 'right', marginRight: '20px' }}>
                <button onClick={salvarDados} style={{ ...adminStyles.saveBtn, backgroundColor: '#2299FF', zIndex: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>💾 Salvar Alterações</button>
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