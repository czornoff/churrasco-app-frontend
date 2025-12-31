import React, { useEffect, useState } from 'react';
import { commonStyles as styles } from '../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;

const formatarData = (dataISO) => {
    if (!dataISO) return "Data não disponível";
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function Usuarios() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [mostrarModalAdicao, setMostrarModalAdicao] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', role: 'user' });
    const [adminLogadoId, setAdminLogadoId] = useState(null);

    useEffect(() => {
        // Busca os dados do usuário atual (você já deve ter uma rota /auth/usuario)
        fetch(`${API_URL}/auth/usuario`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setAdminLogadoId(data._id));

        carregarUsuarios();
    }, []);

    const carregarUsuarios = () => {
        fetch(`${API_URL}/admin/usuarios`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setListaUsuarios(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar usuários:", err);
                setLoading(false);
            });
    };

    const handleAtualizar = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin/usuarios/${usuarioEditando._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: usuarioEditando.role,
                    status: usuarioEditando.status
                }),
                credentials: 'include'
            });

            if (res.ok) {
                alert("✅ Usuário atualizado com sucesso!");
                setUsuarioEditando(null);
                carregarUsuarios();
            } else {
                const errorData = await res.json();
                alert(`Erro: ${errorData.message || 'Falha ao atualizar'}`);
            }
        } catch (error) {
            alert("Erro de conexão ao atualizar usuário");
        }
    };

    const excluirUsuario = async (id) => {
        // 1. Confirmação para evitar cliques acidentais
        if (window.confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente este usuário?")) {
            try {
                const res = await fetch(`${API_URL}/admin/usuarios/${id}`, { 
                    method: 'DELETE',
                    credentials: 'include' // Essencial para o middleware eAdmin funcionar
                });

                const data = await res.json();

                if (res.ok) {
                    // 2. Atualiza a lista localmente para remover o card imediatamente
                    setListaUsuarios(listaUsuarios.filter(u => u._id !== id));
                    alert("✅ Usuário removido com sucesso!");
                } else {
                    // 3. Exibe mensagem de erro do servidor (ex: se tentar excluir a si mesmo)
                    alert(`Erro: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro de conexão ao tentar excluir o usuário.");
            }
        }
    };

    if (loading) return <div style={styles.container}><h3>Carregando usuários...</h3></div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>👥 Gestão de Usuários</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p style={styles.subtitle}>Gerencie permissões e acessos</p>
                    <button 
                        onClick={() => setMostrarModalAdicao(true)} 
                        style={addBtnStyle}
                    >
                        + Novo Usuário
                    </button>
                </div>
            </header>

            <div style={styles.grid}>
                {listaUsuarios.map(user => (
                    <div key={user._id} style={userCardStyle}>
                        <div style={userAvatar}>
                            <img 
                                src={user.avatar || '/default-avatar.png'} 
                                alt={user.nome} 
                                style={{ width: '100%', height: '100%', borderRadius: '25px', objectFit: 'cover' }} 
                            />
                        </div>
                        <div style={userInfo}>
                            <h5 style={{ margin: 0, fontSize: '16px' }}>
                                <span style={user.status === 'active' ? { color: '#2e7d32' } : { color: '#d32f2f', textDecoration: 'line-through' }}>
                                    {user.nome || 'Sem nome'}
                                </span>
                            </h5>
                            <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{user.email}</p>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ ...roleBadge, backgroundColor: user.role === 'admin' ? '#ff5252' : '#2196F3' }}>
                                    {user.role?.toUpperCase()}
                                </span>
                                <span style={{ fontSize: '10px', color: '#888' }}>● {user.status}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button title="Editar" onClick={() => setUsuarioEditando(user)} style={editIconBtn}>✏️</button>
                            {user._id !== adminLogadoId && (
                                <button 
                                    title="Excluir" 
                                    onClick={() => excluirUsuario(user._id)} 
                                    style={deleteBtn}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDIÇÃO */}
            {usuarioEditando && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3 style={{ marginTop: 0, color: '#333' }}>Editar Usuário</h3>
                        <p style={{ fontSize: '14px', color: '#666' }}><strong>Nome:</strong> {usuarioEditando.nome}</p>
                        
                        <form onSubmit={handleAtualizar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {usuarioEditando._id !== adminLogadoId ? (
                                <div>
                                    <label style={labelStyle}>Permissão (Role):</label>
                                    <select 
                                        style={selectStyle}
                                        value={usuarioEditando.role}
                                        onChange={e => setUsuarioEditando({...usuarioEditando, role: e.target.value})}
                                    >
                                        <option value="user">Usuário Comum</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label style={labelStyle}>Permissão (Role):</label>
                                    <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                                        <strong>ADMINISTRADOR</strong> (Você não pode alterar sua própria permissão)
                                    </p>
                                </div>
                            )}

                            <div>
                                <label style={labelStyle}>Status da Conta:</label>
                                <select 
                                    style={selectStyle}
                                    value={usuarioEditando.status || 'active'}
                                    onChange={e => setUsuarioEditando({...usuarioEditando, status: e.target.value})}
                                >
                                    <option value="active">Ativo (Active)</option>
                                    <option value="inactive">Inativo (Inactive)</option>
                                    <option value="banned">Banido (Banned)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={saveBtn}>Salvar Alterações</button>
                                <button type="button" onClick={() => setUsuarioEditando(null)} style={cancelBtn}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarModalAdicao && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3 style={{ marginTop: 0 }}>Cadastrar Novo Usuário</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await fetch(`${API_URL}/admin/usuarios`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(novoUsuario),
                                credentials: 'include'
                            });
                            if (res.ok) {
                                alert("Usuário criado!");
                                setMostrarModalAdicao(false);
                                setNovoUsuario({ nome: '', email: '', senha: '', role: 'user' });
                                carregarUsuarios();
                            } else {
                                const data = await res.json();
                                alert(data.message);
                            }
                        }}>
                            <label style={labelStyle}>Nome Completo:</label>
                            <input 
                                required style={selectStyle} 
                                value={novoUsuario.nome}
                                onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                            />

                            <label style={labelStyle}>E-mail:</label>
                            <input 
                                type="email" required style={selectStyle} 
                                value={novoUsuario.email}
                                onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})}
                            />

                            <label style={labelStyle}>Senha Inicial:</label>
                            <input 
                                type="password" required style={selectStyle} 
                                value={novoUsuario.senha}
                                onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                            />

                            <label style={labelStyle}>Permissão:</label>
                            <select 
                                style={selectStyle}
                                value={novoUsuario.role}
                                onChange={e => setNovoUsuario({...novoUsuario, role: e.target.value})}
                            >
                                <option value="user">Usuário Comum</option>
                                <option value="admin">Administrador</option>
                            </select>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="submit" style={saveBtn}>Criar Conta</button>
                                <button type="button" onClick={() => setMostrarModalAdicao(false)} style={cancelBtn}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos
const userCardStyle = { ...styles.card, width: '320px', flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '20px', borderTop: 'none', borderLeft: '5px solid #ff5252' };
const userAvatar = { width: '50px', height: '50px', borderRadius: '25px', backgroundColor: '#eee' };
const userInfo = { flex: 1 };
const roleBadge = { fontSize: '9px', padding: '2px 6px', borderRadius: '10px', color: 'white', fontWeight: 'bold' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };
const editIconBtn = { background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#555' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff' };
const saveBtn = { flex: 2, padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtn = { flex: 1, padding: '12px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const addBtnStyle = {backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
};