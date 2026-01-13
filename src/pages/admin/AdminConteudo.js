import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const API_URL = process.env.REACT_APP_API_URL;
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_KEY;
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

    useEffect(() => {
        if (abaAtiva === 'layout') {
            fetch(`${API_URL}/admin/listar-logos`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => setUltimasLogos(data))
                .catch(err => console.error("Erro ao carregar histórico de logos", err));
        }
    }, [abaAtiva, conteudo.logoUrl]);

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
        const tituloItem = conteudo[categoria]?.itens[index]?.titulo || 'este item';
        const confirmacao = window.confirm(`Tem certeza que deseja remover "${tituloItem}"?`);

        if (confirmacao) {
            setConteudo(prev => {
                const novaLista = prev[categoria].itens.filter((_, i) => i !== index);
                return {
                    ...prev,
                    [categoria]: { ...prev[categoria], itens: novaLista }
                };
            });
        }
    };

    const fazerUploadLogo = async (arquivo) => {
        if (!arquivo) return;

        const formData = new FormData();
        formData.append('logo', arquivo);

        try {
            setMensagem('⏳ Enviando imagem...');
            const res = await fetch(`${API_URL}/admin/upload-logo`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
                handleConfigChange('layout', 'logoUrl', data.url);
                setMensagem('✅ Logo enviada! Não esqueça de Salvar Alterações.');
            } else {
                alert('Erro no upload');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao conectar com servidor de imagens');
        }
    };

    return (
        <div style={styles.container}>
            {mensagem && <div style={adminStyles.msgStyle}>{mensagem}</div>}
            
            <header style={adminStyles.headerRow}>
                <h1 style={styles.title}>📝 Gerenciar Conteúdo</h1>
                <p style={styles.subtitle}>Altere textos, dicas e receitas do app</p>
            </header>

            {/* Menu de Abas */}
            <div style={adminStyles.tabBar}>
                {['layout', 'inicio', 'sobre', 'dicas', 'produtos', 'utensilios', 'receitas'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setAbaAtiva(tab)}
                        style={{
                            ...adminStyles.tabBtn, 
                            ...(abaAtiva === tab ? adminStyles.statusAtivo : adminStyles.statusInativo)
                        }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={styles.contentWrapper}>
                {/* ABA CONFIGURAÇÕES DO LAYOUT */}
                {abaAtiva === 'layout' && (
                    <div style={styles.column}>
                        <label style={adminStyles.label}>Nome do App:</label>
                        <input style={adminStyles.input} value={conteudo.nomeApp || ''} onChange={e => handleConfigChange('layout', 'nomeApp', e.target.value)} />

                        {/* SEÇÃO DE CORES GLOBAIS */}
                        <h3 style={styles.cardHeaderTitle}>Paleta de Cores</h3>
                        <div style={styles.colorGrid}>
                            {[
                                { label: 'Primária (Ações)', key: 'primary', default: '#2299ff' },
                                { label: 'Secundária (Menu)', key: 'secondary', default: '#555555' },
                                { label: 'Sucesso (Botões)', key: 'success', default: '#44aa55' },
                                { label: 'Perigo (Excluir)', key: 'danger', default: '#ff5555' },
                                { label: 'Aviso (Alertas)', key: 'warning', default: '#ffcc00' },
                                { label: 'Info (Dicas)', key: 'info', default: '#31D2F2' }
                            ].map((cor) => (
                                <div key={cor.key} style={styles.colorItem}>
                                    <label style={adminStyles.label}>{cor.label}:</label>
                                    <div style={styles.colorInputGroup}>
                                        <input 
                                            type="color" 
                                            value={conteudo[cor.key] || cor.default} 
                                            onChange={e => handleConfigChange('layout', cor.key, e.target.value)}
                                            style={styles.colorPicker}
                                        />
                                        <input 
                                            style={{...adminStyles.input, ...styles.colorHexInput}} 
                                            value={conteudo[cor.key] || ''} 
                                            placeholder={cor.default}
                                            onChange={e => handleConfigChange('layout', cor.key, e.target.value)} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={styles.cardTitle}>Identidade Visual</h3>
                        <div style={styles.logoWrapper}>
                            <label style={adminStyles.label}>Logotipo Atual:</label>
                            <img 
                                src={conteudo.logoUrl ? `${API_URL}${conteudo.logoUrl}` : '/logos/logo.png'} 
                                alt="Logotipo Atual" 
                                style={styles.logoPreview} 
                            />
                            
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => fazerUploadLogo(e.target.files[0])} 
                                style={adminStyles.input}
                            />

                            {/* SELEÇÃO DE LOGOS ANTIGAS */}
                            {ultimasLogos.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ ...adminStyles.label, fontSize: '0.8rem' }}>Usar uma das últimas 10 enviadas:</label>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                        {ultimasLogos.map((logo, idx) => (
                                            <img 
                                                alt="Logotipo Antigo" 
                                                key={idx}
                                                src={`${API_URL}${logo.url}`}
                                                onClick={() => handleConfigChange('layout', 'logoUrl', logo.url)}
                                                title="Clique para selecionar esta imagem"
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'contain',
                                                    border: conteudo.logoUrl === logo.url ? '2px solid #e53935' : '1px solid #ddd',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    padding: '2px',
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <small style={styles.helperText}>O arquivo será salvo no diretório public do servidor.</small>
                        </div>
                    </div>
                )}

                {/* ABA INICIO */}
                {abaAtiva === 'inicio' && (
                    <div style={styles.column}>
                        <h3 style={styles.cardTitle}>Página Inicial</h3>
                        <div style={styles.adminWrapper}>
                            <label style={adminStyles.label}>Título da Seção:</label>
                            <input style={adminStyles.input} value={conteudo.inicioTitulo || ''} onChange={e => handleConfigChange('inicio', 'inicioTitulo', e.target.value)} />
                            <label style={adminStyles.label}>História/Texto:</label>
                            <Editor
                                apiKey={TINYMCE_API_KEY}
                                value={conteudo.inicioTexto || ''}
                                init={{...TINYMCE_INIT,
                                    height: 400
                                }}
                                onEditorChange={(novoConteudo) => handleConfigChange('inicio', 'inicioTexto', novoConteudo)}
                            />
                        </div>
                    </div>
                )}

                {/* ABA SOBRE */}
                {abaAtiva === 'sobre' && (
                    <div style={styles.column}>
                        <h3 style={styles.cardTitle}>Página Sobre</h3>
                        <div style={styles.adminWrapper}>
                            <label style={adminStyles.label}>Título da Seção:</label>
                            <input style={adminStyles.input} value={conteudo.sobreTitulo || ''} onChange={e => handleConfigChange('sobre', 'sobreTitulo', e.target.value)} />
                            <label style={adminStyles.label}>História/Texto:</label>
                            <Editor
                                apiKey={TINYMCE_API_KEY}
                                value={conteudo.sobreTexto || ''}
                                init={{...TINYMCE_INIT,
                                    height: 400
                                }}
                                onEditorChange={(novoConteudo) => handleConfigChange('sobre', 'sobreTexto', novoConteudo)}
                            />
                        </div>
                    </div>
                )}

                {/* GESTÃO DE CARDS DINÂMICOS */}
                {['dicas', 'produtos', 'receitas', 'utensilios'].includes(abaAtiva) && (
                    <div>
                        <div style={styles.tabContainer}>
                            <h3 style={styles.cardTitle}>Cabeçalho da Página</h3>
                            <div style={styles.adminWrapper}>
                                <input style={adminStyles.input} placeholder="Título da Página" value={conteudo[abaAtiva]?.titulo || ''} onChange={e => handleConfigChange(abaAtiva, 'titulo', e.target.value)} />
                                <input style={adminStyles.input} placeholder="Subtítulo" value={conteudo[abaAtiva]?.subtitulo || ''} onChange={e => handleConfigChange(abaAtiva, 'subtitulo', e.target.value)} />
                            </div>
                        </div>
                        
                        <hr style={styles.sectionDivider} />
                        
                        <div style={adminStyles.flexRowSpace}>
                            <h3 style={styles.cardTitle}>Cards de {abaAtiva}</h3>
                            <div style={styles.adminWrapper}>
                                <button onClick={() => adicionarItem(abaAtiva)} style={adminStyles.addBtn}>+ Adicionar Card</button>
                            </div>
                        </div>

                        <div style={adminStyles.gridContainer}>
                            {conteudo[abaAtiva]?.itens?.map((item, index) => (
                                <div key={index} style={adminStyles.cardBox}>
                                    {abaAtiva === 'receitas' ? (
                                        <>
                                            <div style={adminStyles.flexRowGap}>
                                                <input style={{...adminStyles.input, ...styles.inputFlex}} value={item.titulo || ''} onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} />
                                                <input style={{...adminStyles.input, ...styles.inputIcon}} value={item.icone || ''} onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} />
                                            </div>
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
                                            <Editor
                                                apiKey={TINYMCE_API_KEY}
                                                value={ item.preparo || '' }
                                                init={{...TINYMCE_INIT,
                                                    height: 150
                                                }}
                                                onEditorChange={(novoConteudo) => handleListChange(abaAtiva, index, 'preparo', novoConteudo)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div style={adminStyles.flexRowGap}>
                                                <input style={{...adminStyles.input, ...styles.inputFlex}} value={item.titulo || ''} onChange={e => handleListChange(abaAtiva, index, 'titulo', e.target.value)} />
                                                <input style={{...adminStyles.input, ...styles.inputIcon}} value={item.icone || ''} onChange={e => handleListChange(abaAtiva, index, 'icone', e.target.value)} />
                                            </div>
                                            <Editor
                                                apiKey={TINYMCE_API_KEY}
                                                value={item.texto || ''}
                                                init={{...TINYMCE_INIT,
                                                    height: 150
                                                }}
                                                onEditorChange={(novoConteudo) => handleListChange(abaAtiva, index, 'texto', novoConteudo)}
                                            />
                                        </>
                                    )}
                                    <button onClick={() => excluirItem(abaAtiva, index)} style={adminStyles.deleteBtn}>🗑️ Remover</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div style={adminStyles.divBtnSalvar}>
                <button onClick={salvarDados} style={adminStyles.saveBtn}>SALVAR TODAS AS ALTERAÇÕES</button>
            </div>
        </div>
    );
}