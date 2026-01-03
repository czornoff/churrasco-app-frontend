import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { commonStyles as styles, adminStyles } from '../../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminItem({ opcoes, setOpcoes }) {
    const [novoItem, setNovoItem] = useState({ 
        nome: '', 
        subcategoria: 'Bovina', 
        categoria: 'carnes' 
    });
    
    const [mensagem, setMensagem] = useState('');

    if (!opcoes || Object.keys(opcoes).length === 0) {
        return <div style={adminStyles.loading}><h2>Carregando configurações...</h2></div>;
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
        } else {
            item.gramasPorAdulto = 50;
            item.unidade = 'g';
        }

        novosDados[novoItem.categoria].push(item);
        salvarNoServidor(novosDados);
        setNovoItem({ ...novoItem, nome: '' });
    };

    return (
        <div style={styles.container}>
            {mensagem && <div style={adminStyles.toast}>{mensagem}</div>}

            <header style={styles.header}>
                <h1 style={styles.title}>⚙️ Gerenciar Itens e Regras</h1>
            </header>

            {/* SEÇÃO DE COTAS GERAIS */}
            <div style={adminStyles.cotaGrid}>
                <div style={{ ...adminStyles.cotaCard, background: '#fff3e0', borderColor: '#ffe0b2' }}>
                    <h4 style={adminStyles.cotaTitle}>🥩 Carne (Homem)</h4>
                    <div style={adminStyles.inputGroup}>
                        <input type="number" style={adminStyles.inlineInput} value={opcoes.configuracoes?.gramasCarneAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneAdulto: parseInt(e.target.value) || 0}})} />
                        <span>g</span>
                    </div>
                    <p style={adminStyles.cotaDesc}>* Mulher: 75% | Criança: 45%</p>
                </div>
                
                <div style={{ ...adminStyles.cotaCard, background: '#e1f5fe', borderColor: '#b3e5fc' }}>
                    <h4 style={adminStyles.cotaTitle}>🥗 Acompanhamentos</h4>
                    <div style={adminStyles.inputGroup}>
                        <input type="number" style={adminStyles.inlineInput} value={opcoes.configuracoes?.gramasOutrosAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasOutrosAdulto: parseInt(e.target.value) || 0}})} />
                        <span>g</span>
                    </div>
                    <p style={adminStyles.cotaDesc}>* Distribuído entre os itens.</p>
                </div>

                <div style={{ ...adminStyles.cotaCard, background: '#e8f5e9', borderColor: '#c8e6c9' }}>
                    <h4 style={adminStyles.cotaTitle}>🥤 Bebida Total</h4>
                    <div style={adminStyles.inputGroup}>
                        <input type="number" style={adminStyles.inlineInput} value={opcoes.configuracoes?.mlBebidaAdulto || 0} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, mlBebidaAdulto: parseInt(e.target.value) || 0}})} />
                        <span>ml</span>
                    </div>
                    <p style={adminStyles.cotaDesc}>* Sugestão de consumo por adulto.</p>
                </div>
            </div>

            {/* FORMULÁRIO DE ADIÇÃO */}
            <section style={styles.contentWrapper}>
                <h3 style={{...styles.cardTitle, marginBottom: '15px'}}>➕ Adicionar Novo Item</h3>
                <div style={adminStyles.addForm}>
                    <input placeholder="Nome do item (ex: Picanha)" value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} style={adminStyles.input} />
                    
                    <select value={novoItem.categoria} onChange={e => {
                        const cat = e.target.value;
                        let sub = (cat === 'carnes') ? 'Bovina' : (cat === 'bebidas' ? 'Não Alcoólica' : '');
                        setNovoItem({ ...novoItem, categoria: cat, subcategoria: sub });
                    }} style={adminStyles.select}>
                        <option value="carnes">Carnes</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="adicionais">Adicionais</option>
                        <option value="acompanhamentos">Acompanhamentos</option>
                        <option value="utensilios">Utensílios</option>
                    </select>

                    {novoItem.categoria === 'carnes' && (
                        <select value={novoItem.subcategoria} onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})} style={adminStyles.select}>
                            {['Bovina', 'Suína', 'Frango', 'Linguiças', 'Outros'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )}

                    {novoItem.categoria === 'bebidas' && (
                        <select value={novoItem.subcategoria} onChange={e => setNovoItem({...novoItem, subcategoria: e.target.value})} style={adminStyles.select}>
                            <option value="Não Alcoólica">Não Alcoólica</option>
                            <option value="Alcoólica">Alcoólica</option>
                        </select>
                    )}

                    <button onClick={adicionarItem} style={adminStyles.addBtn}>ADICIONAR</button>
                </div>
            </section>
            <div style={adminStyles.divBtnSalvar}>
                <div style={adminStyles.headerButtons}>
                    <button onClick={() => salvarNoServidor(opcoes)} style={adminStyles.saveAllBtn}>SALVAR TUDO</button>
                    <Link to="/admin"><button style={adminStyles.exitBtn}>VOLTAR</button></Link>
                </div>
            </div>

            {/* LISTAGEM DE ITENS POR CATEGORIA */}
            {Object.keys(opcoes).filter(k => Array.isArray(opcoes[k])).map(cat => (
                <div key={cat} style={adminStyles.categorySection}>
                    <h3 style={adminStyles.categoryHeader}>{cat.toUpperCase()}</h3>
                    <div style={adminStyles.itemsList}>
                        {opcoes[cat].sort((a, b) => a.nome.localeCompare(b.nome)).map(item => (
                            <div key={item.id} style={adminStyles.itemRow}>
                                <div style={adminStyles.itemMainInfo}>
                                    <strong style={adminStyles.itemName}>{item.nome}</strong>
                                    <span style={adminStyles.itemSub}>{item.subcategoria}</span>
                                </div>

                                <div style={adminStyles.itemConfigs}>
                                    {cat === 'carnes' && (
                                        <div style={adminStyles.configField}>
                                            <label>Peso Rel.:</label>
                                            <input type="number" style={adminStyles.numInput} value={item.pesoRelativo} onChange={e => atualizarCampoItem(cat, item.id, 'pesoRelativo', e.target.value)} />
                                        </div>
                                    )}

                                    {cat === 'bebidas' && (
                                        <>
                                            <select style={adminStyles.smallSelect} value={item.subcategoria} onChange={e => atualizarCampoItem(cat, item.id, 'subcategoria', e.target.value)}>
                                                <option value="Não Alcoólica">Não Alcoólica</option>
                                                <option value="Alcoólica">Alcoólica</option>
                                            </select>
                                            <div style={adminStyles.configField}>
                                                <label>Emb:</label>
                                                <input type="number" style={adminStyles.numInput} value={item.embalagem} onChange={e => atualizarCampoItem(cat, item.id, 'embalagem', e.target.value)} />
                                                <span>ml</span>
                                            </div>
                                        </>
                                    )}

                                    {cat === 'utensilios' && (
                                        <>
                                            <div style={adminStyles.configField}>
                                                <label>Fator:</label>
                                                <input type="number" step="0.1" style={adminStyles.numInput} value={item.fator} onChange={e => atualizarCampoItem(cat, item.id, 'fator', e.target.value)} />
                                            </div>
                                            <select style={adminStyles.smallSelect} value={item.base} onChange={e => atualizarCampoItem(cat, item.id, 'base', e.target.value)}>
                                                <option value="pessoa">p/ Pessoa</option>
                                                <option value="carne">p/ kg Carne</option>
                                                <option value="fixo">Fixo</option>
                                            </select>
                                        </>
                                    )}

                                    {(cat === 'acompanhamentos' || cat === 'adicionais') && (
                                        <div style={adminStyles.configField}>
                                            <label>Qtd/Adulto:</label>
                                            <input type="number" style={adminStyles.numInput} value={item.gramasPorAdulto || item.qtdPorAdulto} onChange={e => atualizarCampoItem(cat, item.id, item.gramasPorAdulto !== undefined ? 'gramasPorAdulto' : 'qtdPorAdulto', e.target.value)} />
                                            <span>{item.unidade}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={adminStyles.itemActions}>
                                    <label style={adminStyles.switch}>
                                    <input 
                                        type="checkbox" 
                                        checked={item.ativo || false} 
                                        onChange={() => {
                                            const novos = { ...opcoes };
                                            const target = novos[cat].find(x => x.id === item.id);
                                            target.ativo = !target.ativo;
                                            setOpcoes(novos);
                                        }} 
                                        style={adminStyles.switchInput}
                                    />
                                    <span style={{
                                        ...adminStyles.slider,
                                        backgroundColor: item.ativo ? '#4CAF50' : '#ccc'
                                    }}>
                                        <span style={{
                                            ...adminStyles.sliderText,
                                            left: item.ativo ? '20px' : '40px'
                                        }}>{item.ativo ? 'ATIVADO' : 'DESATIVADO'}</span>
                                        <span style={{
                                            ...adminStyles.sliderBall,
                                            transform: item.ativo ? 'translateX(91px)' : 'translateX(4px)'
                                        }} />
                                    </span>
                                </label>
                                    <button onClick={() => {if(window.confirm('Excluir item?')){ const n = {...opcoes}; n[cat] = n[cat].filter(x => x.id !== item.id); salvarNoServidor(n); }}} style={adminStyles.deleteBtn}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={adminStyles.divBtnSalvar}>
                        <div style={adminStyles.headerButtons}>
                            <button onClick={() => salvarNoServidor(opcoes)} style={adminStyles.saveAllBtn}>SALVAR TUDO</button>
                            <Link to="/admin"><button style={adminStyles.exitBtn}>VOLTAR</button></Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}