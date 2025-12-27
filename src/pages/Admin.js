import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Admin({ opcoes, setOpcoes }) {
  const [novoItem, setNovoItem] = useState({ 
    nome: '', 
    subcategoria: 'Bovina', 
    categoria: 'carnes' 
  });
  
  // Estado para a mensagem de feedback
  const [mensagem, setMensagem] = useState('');

  const salvarNoServidor = async (dadosParaSalvar) => {
    try {
      const res = await fetch(`${API_URL}/admin/salvar`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaSalvar)
      });
      const data = await res.json();
      
      if (data.success) {
        setOpcoes(dadosParaSalvar);
        setMensagem('✅ Salvo com sucesso!');
        // Remove a mensagem após 3 segundos
        setTimeout(() => setMensagem(''), 3000);
      }
    } catch (error) {
      alert("Erro ao salvar os dados.");
    }
  };

  const atualizarCampoItem = (categoria, id, campo, valor) => {
    const novosDados = { ...opcoes };
    const item = novosDados[categoria].find(i => i.id === id);
    const camposNumericos = ['pesoRelativo', 'mlPorAdulto', 'gramasPorAdulto', 'qtdPorAdulto', 'embalagem', 'fator'];
    item[campo] = camposNumericos.includes(campo) ? parseFloat(valor) || 0 : valor;
    setOpcoes(novosDados);
  };

  const confirmarExclusao = (categoria, item) => {
    if (window.confirm(`Excluir permanentemente "${item.nome}"?`)) {
      const novosDados = { ...opcoes };
      novosDados[categoria] = novosDados[categoria].filter(i => i.id !== item.id);
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

    const itemFormatado = { id: novoId, nome: novoItem.nome, ativo: true };

    if (novoItem.categoria === 'carnes') {
      itemFormatado.subcategoria = novoItem.subcategoria;
      itemFormatado.pesoRelativo = 10;
    } else if (novoItem.categoria === 'bebidas') {
      itemFormatado.mlPorAdulto = 600;
      itemFormatado.embalagem = 350;
    } else if (novoItem.categoria === 'utensilios') {
      itemFormatado.base = 'pessoa';
      itemFormatado.fator = 1;
    }

    novosDados[novoItem.categoria].push(itemFormatado);
    salvarNoServidor(novosDados);
    setNovoItem({ ...novoItem, nome: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* MENSAGEM DE FEEDBACK FLUTUANTE */}
      {mensagem && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', background: '#4CAF50', color: 'white', 
          padding: '15px 25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          zIndex: 1000, fontWeight: 'bold', animation: 'fadeIn 0.5s'
        }}>
          {mensagem}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>⚙️ Gerenciar Itens</h1>
        <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => salvarNoServidor(opcoes)} style={{ padding: '8px 15px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Salvar Alterações</button>
            <Link to="/"><button style={{ padding: '8px 15px', cursor: 'pointer' }}>Sair</button></Link>
        </div>
      </div>

      {/* --- CONFIGURAÇÕES GERAIS --- */}
      <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffe0b2' }}>
        <h3 style={{marginTop: 0}}>⚖️ Cota de Carne por Pessoa (gramas)</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
            <div>
                <label>Adulto: </label>
                <input type="number" style={{padding: '5px', width: '70px'}} value={opcoes.configuracoes?.gramasCarneAdulto || ''} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneAdulto: parseInt(e.target.value)}})} />
            </div>
            <div>
                <label>Criança: </label>
                <input type="number" style={{padding: '5px', width: '70px'}} value={opcoes.configuracoes?.gramasCarneCrianca || ''} onChange={(e) => setOpcoes({...opcoes, configuracoes: {...opcoes.configuracoes, gramasCarneCrianca: parseInt(e.target.value)}})} />
            </div>
        </div>
      </div>

      {/* --- FORMULÁRIO ADICIONAR --- */}
      <div style={{ background: '#f9f9f9', padding: '20px', border: '2px dashed #ccc', marginBottom: '20px', borderRadius: '8px' }}>
        <h3 style={{marginTop: 0}}>➕ Novo Item</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input placeholder="Ex: Picanha..." value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} style={{ flex: 1, padding: '10px' }} />
          <select value={novoItem.categoria} onChange={e => setNovoItem({ ...novoItem, categoria: e.target.value })} style={{ padding: '10px' }}>
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
          <button onClick={adicionarItem} style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ADICIONAR</button>
        </div>
      </div>

      {/* --- LISTAGEM --- */}
      {Object.keys(opcoes).filter(k => k !== 'configuracoes').map(cat => (
        <div key={cat} style={{ marginBottom: '30px' }}>
          <h3 style={{ textTransform: 'uppercase', background: '#333', color: '#fff', padding: '10px', borderRadius: '4px' }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {opcoes[cat].map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 1fr 0.5fr', alignItems: 'center', gap: '15px', padding: '12px', borderBottom: '1px solid #eee', background: item.ativo ? '#fff' : '#f9f9f9' }}>
                
                <span>
                    <strong>{item.nome}</strong> 
                    {item.subcategoria && <div style={{fontSize: '11px', color: '#888'}}>{item.subcategoria}</div>}
                </span>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {cat === 'carnes' && (
                        <div style={{fontSize: '12px'}}>Peso Rel: <input type="number" style={{width: '45px'}} value={item.pesoRelativo} onChange={(e) => atualizarCampoItem(cat, item.id, 'pesoRelativo', e.target.value)} /></div>
                    )}
                    {cat === 'bebidas' && (
                        <div style={{fontSize: '12px'}}>Cons: <input type="number" style={{width: '50px'}} value={item.mlPorAdulto} onChange={(e) => atualizarCampoItem(cat, item.id, 'mlPorAdulto', e.target.value)} />ml | Emb: <input type="number" style={{width: '50px'}} value={item.embalagem} onChange={(e) => atualizarCampoItem(cat, item.id, 'embalagem', e.target.value)} />ml</div>
                    )}
                    {(cat === 'acompanhamentos' || cat === 'adicionais') && (
                        <div style={{fontSize: '12px'}}>Qtd: <input type="number" style={{width: '50px'}} value={item.gramasPorAdulto || item.qtdPorAdulto} onChange={(e) => atualizarCampoItem(cat, item.id, item.gramasPorAdulto ? 'gramasPorAdulto' : 'qtdPorAdulto', e.target.value)} /> {item.unidade || 'g'}</div>
                    )}
                    {cat === 'utensilios' && (
                        <div style={{fontSize: '12px'}}>Fat: <input type="number" step="0.1" style={{width: '40px'}} value={item.fator} onChange={(e) => atualizarCampoItem(cat, item.id, 'fator', e.target.value)} /> 
                            <select style={{fontSize: '10px', marginLeft: '5px'}} value={item.base} onChange={(e) => atualizarCampoItem(cat, item.id, 'base', e.target.value)}>
                                <option value="pessoa">p/ Pessoa</option>
                                <option value="carne">p/ kg Carne</option>
                                <option value="fixo">Fixo</option>
                            </select>
                        </div>
                    )}
                </div>

                <div style={{textAlign: 'right'}}>
                    <label className="switch">
                        <input type="checkbox" checked={item.ativo} onChange={() => {
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

                <button onClick={() => confirmarExclusao(cat, item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', textAlign: 'right' }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}