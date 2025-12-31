import React, { useState } from 'react';
import { commonStyles as styles } from '../components/Styles';
import { Editor } from '@tinymce/tinymce-react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminConteudo({ conteudo, setConteudo, atualizarApp }) {
    const [abaAtiva, setAbaAtiva] = useState('site');
    const [mensagem, setMensagem] = useState('');

    if (!conteudo) return <div style={{padding: '50px', textAlign: 'center'}}>Carregando configurações...</div>;

    // FUNÇÃO REAL DE SALVAMENTO
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
                // USAR O DADO QUE VEM DO BACKEND É O MAIS SEGURO
                setConteudo({ ...respostaJson.data }); 
                if (atualizarApp) {
                    atualizarApp(); 
                }
                setMensagem('✅ Conteúdo atualizado com sucesso!');
                setTimeout(() => setMensagem(''), 3000);
            } else {
                alert("Erro ao salvar no servidor.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão.");
        }
    };

    // Handler para campos simples e objetos aninhados
    const handleConfigChange = (aba, campo, valor) => {
        if (aba === 'site' || aba === 'sobre') {
            setConteudo(prev => ({ ...prev, [campo]: valor }));
        } else {
            setConteudo(prev => ({
                ...prev,
                [aba]: { ...prev[aba], [campo]: valor }
            }));
        }
    };

    // Handler para editar itens dentro de uma lista (ex: lista de dicas)
    const handleListChange = (categoria, index, campo, valor) => {
        const novaLista = [...(conteudo[categoria]?.itens || [])];
        novaLista[index] = { ...novaLista[index], [campo]: valor };
        setConteudo(prev => ({
            ...prev,
            [categoria]: { 
                ...prev[categoria], 
                itens: novaLista 
            }
        }));
    };

    const adicionarItem = (categoria) => {
        const novoItem = { titulo: 'Novo Item', texto: '', icone: '🔥' };
        setConteudo(prev => {
            const novaLista = [...(prev[categoria]?.itens || []), novoItem];
            return {
                ...prev,
                [categoria]: { ...prev[categoria], itens: novaLista }
            };
        });
    };

    const excluirItem = (categoria, index) => {
        setConteudo(prev => {
            const novaLista = prev[categoria].itens.filter((_, i) => i !== index);
            return {
                ...prev,
                [categoria]: { ...prev[categoria], itens: novaLista }
            };
        });
    };

    return (
        <div style={styles.container}>
            {mensagem && <div style={msgStyle}>{mensagem}</div>}
            <header style={styles.header}>
                <h1 style={styles.title}>📝 Gerenciar Conteúdo</h1>
                <p style={styles.subtitle}>Altere textos, dicas e receitas do app</p>
            </header>

            {/* Menu de Abas */}
            <div style={tabBar}>
                {['site', 'sobre', 'dicas', 'produtos', 'receitas', 'utensilios'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setAbaAtiva(tab)}
                        style={{...tabBtn, backgroundColor: abaAtiva === tab ? '#ff5252' : '#333'}}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={formContainer}>
                {/* ABA CONFIGURAÇÕES DO SITE */}
                {abaAtiva === 'site' && (
                    <div style={column}>
                        <h3>Geral do Site</h3>
                        <label style={labelL}>Nome do App:</label>
                        <input style={input} value={conteudo.nomeApp || ''} onChange={e => handleConfigChange('site', 'nomeApp', e.target.value)} />
                        
                        <label style={labelL}>Slogan:</label>
                        <input style={input} value={conteudo.slogan || ''} onChange={e => handleConfigChange('site', 'slogan', e.target.value)} />
                        
                        <label style={labelL}>E-mail de Contato:</label>
                        <input style={input} value={conteudo.email || ''} onChange={e => handleConfigChange('site', 'email', e.target.value)} />
                    </div>
                )}

                {/* ABA SOBRE */}
                {abaAtiva === 'sobre' && (
                    <div style={column}>
                        <h3>Página Sobre</h3>
                        <label style={labelL}>Título da Seção:</label>
                            <input style={input} value={conteudo.sobreTitulo || ''} onChange={e => handleConfigChange('sobre', 'sobreTitulo', e.target.value)} />
                        <label style={labelL}>História/Texto:</label>
                            <Editor
                                apiKey='gai8ca82wrpwjb07w2mzvf4yscwbk7ycvvkn8clrijtvzuvf'
                                value={conteudo.sobreTexto || ''}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                onEditorChange={(novoConteudo) => handleConfigChange('sobre', 'sobreTexto', novoConteudo)}
                            />
                    </div>
                )}

                {/* GESTÃO DE CARDS DINÂMICOS */}
                {['dicas', 'produtos', 'receitas', 'utensilios'].includes(abaAtiva) && (
                    <div>
                        <div style={{marginBottom: '20px'}}>
                            <h3>Cabeçalho da Página</h3>
                            <input 
                                style={input} 
                                placeholder="Título da Página" 
                                value={conteudo[abaAtiva]?.titulo || ''} 
                                onChange={e => handleConfigChange(abaAtiva, 'titulo', e.target.value)}
                            />
                            <input 
                                style={input} 
                                placeholder="Subtítulo" 
                                value={conteudo[abaAtiva]?.subtitulo || ''} 
                                onChange={e => handleConfigChange(abaAtiva, 'subtitulo', e.target.value)}
                            />
                        </div>
                        
                        <hr />
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3>Cards de {abaAtiva}</h3>
                            <button onClick={() => adicionarItem(abaAtiva)} style={addBtn}>+ Adicionar Card</button>
                        </div>

                        {conteudo[abaAtiva]?.itens?.map((item, index) => (
                            <div key={index} style={cardEditor}>
                                {abaAtiva === 'receitas' ? (
                                    /* LAYOUT ESPECÍFICO PARA RECEITAS */
                                    <>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input 
                                                style={{ ...input, flex: 1 }} 
                                                placeholder="Nome da Receita" 
                                                value={item.titulo || ''} 
                                                onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} 
                                            />
                                            <input 
                                                style={{ ...input, width: '80px' }} 
                                                placeholder="Ícone" 
                                                value={item.icone || ''} 
                                                onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} 
                                            />
                                        </div>

                                        <div style={recipeDetails}>
                                            <input 
                                                style={input} 
                                                placeholder="Tempo (ex: 40 min)" 
                                                value={item.tempo || ''} 
                                                onChange={e => handleListChange(abaAtiva, index, 'tempo', e.target.value)} 
                                            />
                                            <select 
                                                style={input} 
                                                value={item.nivel || 'Fácil'} 
                                                onChange={e => handleListChange(abaAtiva, index, 'nivel', e.target.value)}
                                            >
                                                <option value="Fácil">Fácil</option>
                                                <option value="Médio">Médio</option>
                                                <option value="Difícil">Difícil</option>
                                            </select>
                                        </div>

                                        <label style={labelL}>Ingredientes (um por linha):</label>
                                        <textarea 
                                            style={{ ...textarea, minHeight: '80px' }} 
                                            placeholder="Ingredientes..." 
                                            value={Array.isArray(item.ingredientes) ? item.ingredientes.join('\n') : item.ingredientes || ''} 
                                            onChange={e => handleListChange(abaAtiva, index, 'ingredientes', e.target.value.split('\n'))} 
                                        />

                                        <label style={labelL}>Modo de Preparo:</label>
                                        <textarea 
                                            style={{ ...textarea, minHeight: '100px' }} 
                                            placeholder="Modo de preparo..." 
                                            value={item.preparo || ''} 
                                            onChange={e => handleListChange(abaAtiva, index, 'preparo', e.target.value)} 
                                        />
                                    </>
                                ) : (
                                    /* LAYOUT PADRÃO PARA DICAS, PRODUTOS, ETC */
                                    <>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input 
                                                style={{ ...input, flex: 1 }} 
                                                placeholder="Título" 
                                                value={item.titulo || ''} 
                                                onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} 
                                            />
                                            <input 
                                                style={{ ...input, width: '80px' }} 
                                                placeholder="Ícone" 
                                                value={item.icone || ''} 
                                                onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} 
                                            />
                                        </div>
                                        <textarea 
                                            style={textarea} 
                                            placeholder="Descrição" 
                                            value={item.texto || ''} 
                                            onChange={e => handleListChange(abaAtiva, index, 'texto', e.target.value)} 
                                        />
                                    </>
                                )}

                                <button 
                                    onClick={() => excluirItem(abaAtiva, index)} 
                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}
                                >
                                    Excluir {abaAtiva === 'receitas' ? 'Receita' : 'Item'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={salvarDados} style={saveBtn}>SALVAR TODAS AS ALTERAÇÕES</button>
        </div>
    );
}

// Estilos complementares
const tabBar = { display: 'flex', gap: '5px', marginBottom: '20px', flexWrap: 'wrap' };
const tabBtn = { padding: '10px 15px', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', transition: '0.3s' };
const formContainer = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const input = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };
const textarea = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px', fontFamily: 'inherit' };
const column = { display: 'flex', flexDirection: 'column' };
const labelL = { fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#555', display: 'block' };
const saveBtn = { width: '100%', padding: '18px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', fontSize: '16px' };
const msgStyle = { position: 'fixed', top: '20px', right: '20px', backgroundColor: '#2e7d32', color: 'white', padding: '15px 25px', borderRadius: '8px', zIndex: 4000, fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' };
const cardEditor = { background: '#f8f8f8', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' };
const addBtn = { backgroundColor: '#333', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const recipeDetails = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' };