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

    if (!opcoes || Object.keys(opcoes).length === 0) {
        return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Carregando configurações...</h2>
            <p>Verifique se o backend e o MongoDB estão rodando.</p>
            <Link to="/">Voltar</Link>
        </div>
        );
    }

    // Função centralizada para persistir dados no MongoDB
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
            setOpcoes({...dadosParaSalvar}); // Força atualização do estado global
            setMensagem('✅ Alterações sincronizadas!');
            setTimeout(() => setMensagem(''), 3000);
        } else {
            alert("Erro: Você não tem permissão de administrador.");
        }
        } catch (error) {
        alert("Erro ao conectar com o servidor.");
        }
    };

    const atualizarCampoItem = (categoria, id, campo, valor) => {
        const novosDados = { ...opcoes };
        const item = novosDados[categoria]?.find(i => i.id === id);
        if (!item) return;

        const camposNumericos = ['pesoRelativo', 'mlPorAdulto', 'gramasPorAdulto', 'qtdPorAdulto', 'embalagem', 'fator'];
        item[campo] = camposNumericos.includes(campo) ? parseFloat(valor) || 0 : valor;
        setOpcoes(novosDados);
    };

    const confirmarExclusao = (categoria, item) => {
        if (window.confirm(`Excluir permanentemente "${item.nome}"?`)) {
        const novosDados = { ...opcoes };
        novosDados[categoria] = novosDados[categoria].filter(i => i.id !== item.id);
        // Salva no servidor imediatamente após remover do estado
        salvarNoServidor(novosDados);
        }
    };

    const adicionarItem = () => {
        if (!novoItem.nome) return alert("Digite o nome!");
        const novosDados = { ...opcoes };
        
        const todosItens = Object.keys(opcoes)
        .filter(key => Array.isArray(opcoes[key]))
        .flatMap(key => opcoes[key]);

        const novoId = todosItens.length > 0 ? Math.max(...todosItens.map(i => i.id)) + 1 : 1;
        
        // Objeto base do item
        const itemFormatado = { 
            id: novoId, 
            nome: novoItem.nome, 
            ativo: true
        };

        // --- CONFIGURAÇÕES PADRÃO POR CATEGORIA (Para bater com seu log) ---
        if (novoItem.categoria === 'carnes') {
            itemFormatado.subcategoria = novoItem.subcategoria || 'Bovina';
            itemFormatado.pesoRelativo = 10;
        } else if (novoItem.categoria === 'bebidas') {
            itemFormatado.subcategoria = novoItem.subcategoria || 'Não Alcoólica';
            itemFormatado.mlPorAdulto = 600;
            itemFormatado.embalagem = 350;
        } else if (novoItem.categoria === 'adicionais') {
            itemFormatado.qtdPorAdulto = 100;
            itemFormatado.unidade = "g";
        } else if (novoItem.categoria === 'acompanhamentos') {
            itemFormatado.gramasPorAdulto = 50;
            itemFormatado.unidade = "g";
        } else if (novoItem.categoria === 'utensilios') {
            itemFormatado.base = 'pessoa';
            itemFormatado.fator = 1;
            itemFormatado.unidade = "un";
        }

        if (!Array.isArray(novosDados[novoItem.categoria])) {
            novosDados[novoItem.categoria] = [];
        }

        novosDados[novoItem.categoria].push(itemFormatado);
        salvarNoServidor(novosDados);
        setNovoItem({ ...novoItem, nome: '' });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        
        {mensagem && (
            <div style={{
            position: 'fixed', top: '20px', right: '20px', background: '#4CAF50', color: 'white', 
            padding: '15px 25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            zIndex: 1000, fontWeight: 'bold'
            }}>
            {mensagem}
            </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>⚙️ Gerenciar Itens</h1>
            <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => salvarNoServidor(opcoes)} style={{ padding: '10px 20px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>SALVAR TUDO</button>
                <Link to="/"><button style={{ padding: '10px 20px', cursor: 'pointer', background: '#888', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>SAIR</button></Link>
            </div>
        </div>

        {/* Cota de Carnes */}
        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffe0b2' }}>
            <h3 style={{marginTop: 0}}>⚖️ Cota de Carne por Pessoa (gramas)</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
                <label>Adulto: <input type="number" style={{padding: '5px', width: '70px'}} value={opcoes.configuracoes?.gramasCarneAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneAdulto: parseInt(e.target.value) || 0}})} /></label>
                <label>Criança: <input type="number" style={{padding: '5px', width: '70px'}} value={opcoes.configuracoes?.gramasCarneCrianca || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneCrianca: parseInt(e.target.value) || 0}})} /></label>
            </div>
        </div>

        {/* Formulário Novo Item */}
        <div style={{ background: '#f9f9f9', padding: '20px', border: '2px dashed #ccc', marginBottom: '20px', borderRadius: '8px' }}>
            <h3 style={{marginTop: 0}}>➕ Novo Item</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input placeholder="Nome do item..." value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} style={{ flex: 1, padding: '10px' }} />
            
            <select value={novoItem.categoria} onChange={e => setNovoItem({ ...novoItem, categoria: e.target.value, subcategoria: e.target.value === 'carnes' ? 'Bovina' : 'Não Alcoólica' })} style={{ padding: '10px' }}>
                <option value="carnes">Carnes</option>
                <option value="bebidas">Bebidas</option>
                <option value="adicionais">Adicionais</option>
                <option value="acompanhamentos">Acompanhamentos</option>
                <option value="utensilios">Utensílios</option>
            </select>
            
            {novoItem.categoria === 'carnes' && (
                <select value={novoItem.subcategoria} onChange={e => setNovoItem({ ...novoItem, subcategoria: e.target.value })} style={{ padding: '10px' }}>
                <option value="Bovina">Bovina</option>
                <option value="Suína">Suína</option>
                <option value="Frango">Frango</option>
                <option value="Linguiça">Linguiça</option>
                <option value="Outras">Outras</option>
                </select>
            )}

            {novoItem.categoria === 'bebidas' && (
                <select value={novoItem.subcategoria} onChange={e => setNovoItem({ ...novoItem, subcategoria: e.target.value })} style={{ padding: '10px' }}>
                <option value="Não Alcoólica">Não Alcoólica 🥤</option>
                <option value="Alcoólica">Alcoólica 🍺</option>
                </select>
            )}

            <button onClick={adicionarItem} style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ADICIONAR</button>
            </div>
        </div>

        {/* Listagem de Categorias */}
        {Object.keys(opcoes)
            .filter(k => Array.isArray(opcoes[k]))
            .map(cat => (
            <div key={cat} style={{ marginBottom: '30px' }}>
            <h3 style={{ textTransform: 'uppercase', background: '#333', color: '#fff', padding: '10px', borderRadius: '4px' }}>
                {cat} {cat === 'acompanhamentos' || cat === 'adicionais' ? <span style={{ fontSize: '11px', fontWeight: 'normal' }}>por Pessoa</span> : ''}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {opcoes[cat]?.sort((a, b) => a.nome.localeCompare(b.nome)).map(item => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1fr 0.5fr', alignItems: 'center', gap: '15px', padding: '10px', borderBottom: '1px solid #eee', background: item.ativo ? '#fff' : '#f5f5f5' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>{item.nome}</strong> 
                        <span style={{fontSize: '11px', color: '#888'}}>{cat !== 'bebidas' ? item.subcategoria : ""}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* Bebidas: Seletor de Grupo (Crucial p/ Cálculo) */}
                        {cat === 'bebidas' && (
                            <>
                            <select 
                                value={item.subcategoria || 'Não Alcoólica'} 
                                onChange={(e) => atualizarCampoItem(cat, item.id, 'subcategoria', e.target.value)}
                                style={{fontSize: '12px', padding: '3px'}}
                            >
                                <option value="Não Alcoólica">Não Alcoólica</option>
                                <option value="Alcoólica">Alcoólica</option>
                            </select>
                            <div style={{fontSize: '12px'}}>
                                Consumo: <input type="number" style={{width: '50px'}} value={item.mlPorAdulto || 0} onChange={(e) => atualizarCampoItem(cat, item.id, 'mlPorAdulto', e.target.value)} />ml | 
                                Emb: <input type="number" style={{width: '50px'}} value={item.embalagem || 0} onChange={(e) => atualizarCampoItem(cat, item.id, 'embalagem', e.target.value)} />ml
                            </div>
                            </>
                        )}

                        {cat === 'carnes' && (
                            <div style={{fontSize: '12px'}}>Peso Relativo: <input type="number" style={{width: '45px'}} value={item.pesoRelativo || 0} onChange={(e) => atualizarCampoItem(cat, item.id, 'pesoRelativo', e.target.value)} />%</div>
                        )}
                        
                        {(cat === 'acompanhamentos' || cat === 'adicionais') && (
                            <div style={{fontSize: '12px'}}>
                                Quantidade: <input 
                                    type="number" 
                                    style={{width: '50px'}} 
                                    // Tenta pegar um ou outro, priorizando o que já existe no objeto
                                    value={item.gramasPorAdulto !== undefined ? item.gramasPorAdulto : (item.qtdPorAdulto || 0)} 
                                    onChange={(e) => {
                                        const campo = item.gramasPorAdulto !== undefined ? 'gramasPorAdulto' : 'qtdPorAdulto';
                                        atualizarCampoItem(cat, item.id, campo, e.target.value);
                                    }} 
                                /> {item.unidade || 'g'}
                                
                                {/* Adicione um seletor de unidade se quiser trocar de 'g' para 'un' no admin */}
                                <select 
                                    value={item.unidade || 'g'} 
                                    onChange={(e) => atualizarCampoItem(cat, item.id, 'unidade', e.target.value)}
                                    style={{fontSize: '10px', marginLeft: '5px'}}
                                >
                                    <option value="g">g</option>
                                    <option value="un">un</option>
                                    <option value="kg">kg</option>
                                </select>
                            </div>
                        )}

                        {cat === 'utensilios' && (
                            <div style={{fontSize: '12px'}}>
                                Fator: <input type="number" step="0.1" style={{width: '40px'}} value={item.fator || 0} onChange={(e) => atualizarCampoItem(cat, item.id, 'fator', e.target.value)} /> 
                                <select style={{fontSize: '11px', marginLeft: '5px'}} value={item.base || 'pessoa'} onChange={(e) => atualizarCampoItem(cat, item.id, 'base', e.target.value)}>
                                    <option value="pessoa">p/ Pessoa</option>
                                    <option value="carne">p/ kg Carne</option>
                                    <option value="fixo">Fixo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div style={{textAlign: 'right'}}>
                        <label className="switch">
                            <input type="checkbox" checked={item.ativo || false} onChange={() => {
                                const novos = { ...opcoes };
                                const target = novos[cat].find(x => x.id === item.id);
                                if (target) {
                                    target.ativo = !target.ativo;
                                    setOpcoes(novos);
                                }
                            }} />
                            <span className="slider">
                                <span className="slider-text">{item.ativo ? 'ON' : 'OFF'}</span>
                            </span>
                        </label>
                    </div>

                    <button onClick={() => confirmarExclusao(cat, item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                </div>
                ))}
            </div>
            </div>
        ))}
        </div>
    );
}