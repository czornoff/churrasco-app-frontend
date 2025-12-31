import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Admin({ opcoes, setOpcoes }) {
    const [novoItem, setNovoItem] = useState({ 
        nome: '', 
        subcategoria: 'Bovina', 
        categoria: 'carnes' 
    });
    
    const [mensagem, setMensagem] = useState('');

    if (!opcoes || Object.keys(opcoes).length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}><h2>Carregando...</h2></div>;

    const salvarNoServidor = async (dadosParaSalvar) => {
        try {
            const res = await fetch(`${API_URL}/admin/salvar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaSalvar),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setOpcoes({...dadosParaSalvar});
                setMensagem('✅ Alterações salvas!');
                setTimeout(() => setMensagem(''), 3000);
            }
        } catch (error) { alert("Erro ao conectar com o servidor."); }
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
        } else {
            item.gramasPorAdulto = 50;
            item.unidade = 'g';
        }

        novosDados[novoItem.categoria].push(item);
        salvarNoServidor(novosDados);
        setNovoItem({ ...novoItem, nome: '' });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {mensagem && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#4CAF50', color: 'white', padding: '15px', borderRadius: '8px', zIndex: 1000 }}>{mensagem}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>⚙️ Gerenciar Itens</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => salvarNoServidor(opcoes)} style={{ padding: '10px 20px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>SALVAR TUDO</button>
                    <Link to="/"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#888', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>SAIR</button></Link>
                </div>
            </div>

            {/* CONFIGURAÇÕES GERAIS - CORRIGIDO PARA SALVAR TODOS OS CAMPOS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#fff3e0', padding: '10px', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
                    <h4 style={{marginTop: 0, marginBottom: 20}}>🥩 Cota Carne (Homem)</h4>
                    <input type="number" value={opcoes.configuracoes?.gramasCarneAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneAdulto: parseInt(e.target.value) || 0}})} /> g
                    <p style={{fontSize: '11px', color: '#666'}}>* Mulher: 75% | Criança: 45%</p>
                </div>
                
                <div style={{ background: '#e1f5fe', padding: '10px', borderRadius: '8px', border: '1px solid #b3e5fc' }}>
                    <h4 style={{marginTop: 0, marginBottom: 20}}>🥗 Cota Acompanhamentos e Adicionais</h4>
                    <input type="number" value={opcoes.configuracoes?.gramasOutrosAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasOutrosAdulto: parseInt(e.target.value) || 0}})} /> g
                    <p style={{fontSize: '11px', color: '#666'}}>* Distribuído proporcionalmente entre os itens selecionados.</p>
                </div>

                <div style={{ background: '#e8f5e9', padding: '10px', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
                    <h4 style={{marginTop: 0, marginBottom: 20}}>🥤 Cota Bebida Total</h4>
                    <input type="number" value={opcoes.configuracoes?.mlBebidaAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, mlBebidaAdulto: parseInt(e.target.value) || 0}})} /> ml
                    <p style={{fontSize: '11px', color: '#666'}}>* Distribuído proporcionalmente entre os itens selecionados.</p>
                </div>
            </div>

            <div style={{ background: '#f9f9f9', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{marginTop: 0}}>➕ Novo Item</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input placeholder="Nome do item..." value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} style={{ padding: '8px', flex: 1, minWidth: '150px' }} />
                    
                    <select value={novoItem.categoria} onChange={e => {
                        const cat = e.target.value;
                        let sub = '';
                        if (cat === 'carnes') sub = 'Bovina';
                        if (cat === 'bebidas') sub = 'Não Alcoólica';
                        setNovoItem({ ...novoItem, categoria: cat, subcategoria: sub });
                    }} style={{ padding: '8px' }}>
                        <option value="carnes">Carnes</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="adicionais">Adicionais</option>
                        <option value="acompanhamentos">Acompanhamentos</option>
                        <option value="utensilios">Utensílios</option>
                    </select>

                    {/* SELEÇÃO DE SUBCATEGORIA PARA CARNES */}
                    {novoItem.categoria === 'carnes' && (
                        <select value={novoItem.subcategoria} onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})} style={{padding: '8px'}}>
                            <option value="Bovina">Bovina</option>
                            <option value="Suína">Suína</option>
                            <option value="Frango">Frango</option>
                            <option value="Linguiças">Linguiças</option>
                            <option value="Outros">Outros</option>
                        </select>
                    )}

                    {/* SELEÇÃO DE TIPO PARA BEBIDAS */}
                    {novoItem.categoria === 'bebidas' && (
                        <select value={novoItem.subcategoria} onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})} style={{padding: '8px'}}>
                            <option value="Não Alcoólica">Não Alcoólica</option>
                            <option value="Alcoólica">Alcoólica</option>
                        </select>
                    )}

                    <button onClick={adicionarItem} style={{ padding: '8px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ADICIONAR</button>
                </div>
            </div>

            {Object.keys(opcoes).filter(k => Array.isArray(opcoes[k])).map(cat => (
                <div key={cat} style={{ marginBottom: '30px' }}>
                    <h3 style={{ textTransform: 'uppercase', background: '#333', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{cat}</h3>
                    {opcoes[cat]
                        .sort((a, b) => a.nome.localeCompare(b.nome))
                        .map(item => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1fr 0.5fr', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <div>
                                <strong>{item.nome}</strong>
                                <div style={{fontSize: '11px', color: '#888'}}>{item.subcategoria}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {cat === 'carnes' && (
                                    <label style={{fontSize: '12px'}}>Peso Relativo: <input type="number" style={{width: '45px'}} value={item.pesoRelativo} onChange={e => atualizarCampoItem(cat, item.id, 'pesoRelativo', e.target.value)} /></label>
                                )}

                                {cat === 'bebidas' && (
                                    <>
                                        <select value={item.subcategoria} onChange={e => atualizarCampoItem(cat, item.id, 'subcategoria', e.target.value)} style={{fontSize: '12px'}}>
                                            <option value="Não Alcoólica">Não Alcoólica</option>
                                            <option value="Alcoólica">Alcoólica</option>
                                        </select>
                                        <label style={{fontSize: '12px'}}>Emb: <input type="number" style={{width: '55px'}} value={item.embalagem} onChange={e => atualizarCampoItem(cat, item.id, 'embalagem', e.target.value)} />ml</label>
                                    </>
                                )}

                                {cat === 'utensilios' && (
                                    <>
                                        <label style={{fontSize: '12px'}}>Fator: <input type="number" step="0.1" style={{width: '45px'}} value={item.fator} onChange={e => atualizarCampoItem(cat, item.id, 'fator', e.target.value)} /></label>
                                        <select value={item.base} onChange={e => atualizarCampoItem(cat, item.id, 'base', e.target.value)} style={{fontSize: '12px'}}>
                                            <option value="pessoa">p/ Pessoa</option>
                                            <option value="carne">p/ kg Carne</option>
                                            <option value="fixo">Fixo</option>
                                        </select>
                                    </>
                                )}

                                {(cat === 'acompanhamentos' || cat === 'adicionais') && (
                                    <label style={{fontSize: '12px'}}>Peso Relativo: <input type="number" style={{width: '50px'}} value={item.gramasPorAdulto || item.qtdPorAdulto} onChange={e => atualizarCampoItem(cat, item.id, item.gramasPorAdulto !== undefined ? 'gramasPorAdulto' : 'qtdPorAdulto', e.target.value)} /> {item.unidade}</label>
                                )}
                            </div>

                            <div style={{textAlign: 'right'}}>
                                <label className="switch">
                                    <input type="checkbox" checked={item.ativo || false} onChange={() => {
                                        const novos = { ...opcoes };
                                        const target = novos[cat].find(x => x.id === item.id);
                                        target.ativo = !target.ativo;
                                        setOpcoes(novos);
                                    }} />
                                    <span className="slider">
                                        <span className="slider-text">{item.ativo ? 'ATIVADO' : 'DESATIVADO'}</span>
                                    </span>
                                </label>
                            </div>

                            <button onClick={() => {if(window.confirm('Excluir?')){ const n = {...opcoes}; n[cat] = n[cat].filter(x => x.id !== item.id); salvarNoServidor(n); }}} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}