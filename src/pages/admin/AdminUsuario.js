import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Usuarios({styles, adminStyles, modalStyles}) {

    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [mostrarModalAdicao, setMostrarModalAdicao] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', role: 'user' });
    const [adminLogadoId, setAdminLogadoId] = useState(null);
    const formatarDataBR = (dataISO) => {
        if (!dataISO) return "";
        return new Date(dataISO).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    useEffect(() => {
        fetch(`${API_URL}/auth/usuario`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setAdminLogadoId(data._id));
        carregarUsuarios();
    }, []);

    const carregarUsuarios = () => {
        fetch(`${API_URL}/api/usuario`, { credentials: 'include' })
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
            const res = await fetch(`${API_URL}/admin/usuario/salvar/${usuarioEditando._id}`, {
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
            }
        } catch (error) {
            alert("Erro de conexão ao atualizar usuário");
        }
    };

    const excluirUsuario = async (id) => {
        if (window.confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente este usuário?")) {
            try {
                const res = await fetch(`${API_URL}/admin/usuario/excluir/${id}`, { 
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (res.ok) {
                    setListaUsuarios(listaUsuarios.filter(u => u._id !== id));
                    alert("✅ Usuário removido com sucesso!");
                }
            } catch (error) {
                alert("Erro de conexão ao tentar excluir o usuário.");
            }
        }
    };

    if (loading) return <div style={styles.container}><h3>Carregando usuários...</h3></div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>👥 Gestão de Usuários</h1>
                <div style={adminStyles.headerActions}>
                    <p style={styles.subtitle}>Gerencie permissões e acessos</p>
                    <button 
                        onClick={() => setMostrarModalAdicao(true)} 
                        style={adminStyles.addBtn}
                    >
                        + Novo Usuário
                    </button>
                </div>
            </header>

            <div style={styles.grid}>
                {listaUsuarios.map(user => (
                    <div key={user._id} style={adminStyles.userCard}>
                        <div style={adminStyles.avatarWrapper}>
                            <img 
                                src={user.avatar || '/default-avatar.png'} 
                                alt={user.nome} 
                                style={adminStyles.avatarImg} 
                            />
                        </div>
                        <div style={adminStyles.userInfo}>
                            <h5 style={adminStyles.userName}>
                                <span style={user.status !== 'active' ? adminStyles.inactiveText : {}}>
                                    {user.nome || 'Sem nome'}
                                </span>
                            </h5>
                            <p style={adminStyles.userEmail}>{user.email}</p>
                            <div style={adminStyles.badgeRow}>
                                <span style={{ ...adminStyles.roleBadge, backgroundColor: adminStyles.roleColors[user.role] || adminStyles.roleColors.user }}>
                                    {user.role?.toUpperCase()}
                                </span>
                                <span style={adminStyles.statusText}>● {user.status}</span>
                            </div>
                        </div>
                        
                        <div style={adminStyles.actionCol}>
                            <button title="Editar" onClick={() => setUsuarioEditando(user)} style={adminStyles.iconBtn}>✏️</button>
                            {user._id !== adminLogadoId && (
                                <button title="Excluir" onClick={() => excluirUsuario(user._id)} style={adminStyles.deleteIconBtn}>🗑️</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDIÇÃO */}
            {usuarioEditando && (
                <div style={modalStyles.overlay}>
                    <div style={{...modalStyles.content, maxWidth: '400px'}}>
                        <button style={modalStyles.closeBtn} onClick={() => setUsuarioEditando(null)}>×</button>
                        <h3 style={modalStyles.sectionTitle}>Editar Usuário</h3>
                        <p style={adminStyles.modalInfo}><strong>Nome:</strong> {usuarioEditando.nome}</p>
                        <p style={adminStyles.modalInfo}><strong>email:</strong> {usuarioEditando.email}</p>
                        <p style={adminStyles.modalInfo}><strong>aniversário:</strong> {formatarDataBR(usuarioEditando.birthday)}</p>
                        <p style={adminStyles.modalInfo}><strong>local:</strong> {usuarioEditando.Cidade}/{usuarioEditando.UF}</p>
                        <p style={adminStyles.modalInfo}><strong>gênero:</strong> {usuarioEditando.genero}</p>
                        <p style={adminStyles.modalInfo}><strong>whatsApp:</strong> {usuarioEditando.whatsApp}</p>
                        
                        <form onSubmit={handleAtualizar} style={adminStyles.modalForm}>
                            <label style={adminStyles.label}>Permissão (Role):</label>
                            {usuarioEditando._id !== adminLogadoId ? (
                                <select 
                                    style={adminStyles.select}
                                    value={usuarioEditando.role}
                                    onChange={e => setUsuarioEditando({...usuarioEditando, role: e.target.value})}
                                >
                                    <option value="user">Usuário Comum</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            ) : (
                                <p style={adminStyles.infoText}>ADMINISTRADOR (Você não pode alterar sua própria permissão)</p>
                            )}

                            <label style={adminStyles.label}>Status da Conta:</label>
                            <select 
                                style={adminStyles.select}
                                value={usuarioEditando.status || 'active'}
                                onChange={e => setUsuarioEditando({...usuarioEditando, status: e.target.value})}
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                                <option value="banned">Banido</option>
                            </select>

                            <div style={adminStyles.btnGroup}>
                                <button type="submit" style={adminStyles.saveBtn}>Salvar Alterações</button>
                                <button type="button" onClick={() => setUsuarioEditando(null)} style={adminStyles.cancelBtn}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE ADIÇÃO */}
            {mostrarModalAdicao && (
                <div style={modalStyles.overlay}>
                    <div style={{...modalStyles.content, maxWidth: '400px'}}>
                        <button style={modalStyles.closeBtn} onClick={() => setMostrarModalAdicao(false)}>×</button>
                        <h3 style={modalStyles.sectionTitle}>Novo Usuário</h3>
                        <form style={adminStyles.modalForm} onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await fetch(`${API_URL}/admin/usuario/salvar`, {
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
                            }
                        }}>
                            <label style={adminStyles.label}>Nome:</label>
                            <input required style={adminStyles.input} value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                            
                            <label style={adminStyles.label}>E-mail:</label>
                            <input type="email" required style={adminStyles.input} value={novoUsuario.email} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} />
                            
                            <label style={adminStyles.label}>Senha Inicial:</label>
                            <input type="password" required style={adminStyles.input} value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />

                            <label style={adminStyles.label}>Permissão:</label>
                            <select style={adminStyles.select} value={novoUsuario.role} onChange={e => setNovoUsuario({...novoUsuario, role: e.target.value})}>
                                <option value="user">Usuário Comum</option>
                                <option value="admin">Administrador</option>
                            </select>

                            <div style={adminStyles.btnGroup}>
                                <button type="submit" style={adminStyles.saveBtn}>Criar Conta</button>
                                <button type="button" onClick={() => setMostrarModalAdicao(false)} style={adminStyles.cancelBtn}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}