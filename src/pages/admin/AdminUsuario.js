import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Usuarios() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [mostrarModalAdicao, setMostrarModalAdicao] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', role: 'user' });
    const [adminLogadoId, setAdminLogadoId] = useState(null);

    const formatarDataBR = (dataISO) => {
        if (!dataISO) return "Não informado";
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

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
                <h3 className="font-black text-neutral-400 uppercase tracking-widest text-xs">Carregando usuários...</h3>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {/* CABEÇALHO DO PAINEL */}
            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        👥
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-0 tracking-tight uppercase">
                            Usuários
                        </h1>
                        <p className="text-1 text-orange-700 dark:text-orange-400 font-medium mt-0">
                            Controle níveis de acesso, permissões de admin e visualize perfis
                        </p>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto pb-2 flex justify-end">
                <button 
                    onClick={() => setMostrarModalAdicao(true)} 
                    className="flex gap-2 text-white font-black py-3 px-6 rounded-xl uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 items-end bg-orange-700 hover:bg-orange-400 hover:scale-110 active:scale-95"
                >
                    + Novo Usuário
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {listaUsuarios.map(user => (
                    <div key={user._id} className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl hover:shadow-xl transition-shadow relative overflow-hidden group">
                        {/* Status Indicator Bar */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        
                        <div className="flex items-start gap-4">
                            <img 
                                src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                                alt={user.nome} 
                                className="w-16 h-16 rounded-xl object-cover bg-neutral-100 dark:bg-zinc-800"
                            />
                            <div className="flex-1 min-w-0">
                                <h5 className={`font-black text-lg truncate uppercase tracking-tighter ${user.status !== 'active' ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-white'}`}>
                                    {user.nome || 'Sem nome'}
                                </h5>
                                <p className="text-xs text-neutral-500 font-bold truncate mb-3">{user.email}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-xl uppercase ${user.role === 'admin' ? 'bg-orange-400 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-xl uppercase ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex gap-2 pt-4 border-t border-neutral-50 dark:border-zinc-800">
                            <button 
                                onClick={() => setUsuarioEditando(user)} 
                                
                                className="flex-1 bg-orange-700 hover:bg-orange-400 text-white text-xs font-[700] uppercase py-2 rounded-xl transition-colors hover:scale-110 active:scale-95"
                            >
                                Detalhes / Editar
                            </button>
                            {user._id !== adminLogadoId && (
                                <button 
                                    onClick={() => excluirUsuario(user._id)} 
                                    className="px-3 bg-red-500 text-text-white hover:bg-red-800 hover:text-white rounded-xl transition-all"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDIÇÃO/DETALHES */}
            {usuarioEditando && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Perfil do Usuário</h3>
                                <button onClick={() => setUsuarioEditando(null)} className="text-neutral-400 hover:text-red-500 text-2xl">×</button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8 bg-neutral-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-neutral-200 dark:border-zinc-800">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase">Aniversário</p>
                                    <p className="text-sm font-bold dark:text-white">{formatarDataBR(usuarioEditando.birthday)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase">Localização</p>
                                    <p className="text-sm font-bold dark:text-white">{usuarioEditando.Cidade || '?'}/{usuarioEditando.UF || '?'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase">Gênero</p>
                                    <p className="text-sm font-bold dark:text-white uppercase">{usuarioEditando.genero || 'N/I'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase">WhatsApp</p>
                                    <p className="text-sm font-bold dark:text-white">{usuarioEditando.whatsApp || 'N/I'}</p>
                                </div>
                            </div>

                            <form onSubmit={handleAtualizar} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Nível de Permissão</label>
                                    {usuarioEditando._id !== adminLogadoId ? (
                                        <select 
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold focus:ring-2 focus:ring-orange-400 transition-all"
                                            value={usuarioEditando.role}
                                            onChange={e => setUsuarioEditando({...usuarioEditando, role: e.target.value})}
                                        >
                                            <option value="user">Usuário Comum</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    ) : (
                                        <div className="p-3 bg-orange-50 dark:bg-orange-700/20 text-orange-700 text-xs font-black rounded-xl border border-orange-400 dark:border-orange-700/30">
                                            ADMINISTRADOR (Você não pode alterar sua própria permissão)
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Status da Conta</label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold focus:ring-2 focus:ring-orange-400 transition-all"
                                        value={usuarioEditando.status || 'active'}
                                        onChange={e => setUsuarioEditando({...usuarioEditando, status: e.target.value})}
                                    >
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                        <option value="banned">Banido</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-orange-700 hover:bg-orange-700 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest transition-all shadow-xl">
                                        Salvar
                                    </button>
                                    <button type="button" onClick={() => setUsuarioEditando(null)} className="px-6 bg-neutral-200 dark:bg-zinc-800 font-black py-4 rounded-xl uppercase text-xs tracking-widest transition-all">
                                        Voltar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ADIÇÃO */}
            {mostrarModalAdicao && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-xl animate-in slide-in-from-bottom-4 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Criar Novo Usuário</h3>
                                <button onClick={() => setMostrarModalAdicao(false)} className="text-neutral-400 hover:text-red-500 text-2xl">×</button>
                            </div>

                            <form className="space-y-4" onSubmit={async (e) => {
                                e.preventDefault();
                                const res = await fetch(`${API_URL}/admin/usuario/salvar`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(novoUsuario),
                                    credentials: 'include'
                                });
                                if (res.ok) {
                                    alert("✅ Usuário criado com sucesso!");
                                    setMostrarModalAdicao(false);
                                    setNovoUsuario({ nome: '', email: '', senha: '', role: 'user' });
                                    carregarUsuarios();
                                }
                            }}>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Nome Completo</label>
                                    <input required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold" 
                                        value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">E-mail de Login</label>
                                    <input type="email" required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold" 
                                        value={novoUsuario.email} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Senha Inicial</label>
                                    <input type="password" required className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold" 
                                        value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Nível de Permissão</label>
                                    <select className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold" 
                                        value={novoUsuario.role} onChange={e => setNovoUsuario({...novoUsuario, role: e.target.value})}>
                                        <option value="user">Usuário Comum</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" 
                                    
                                    
                                    className="flex-1 bg-orange-700 hover:bg-orange-400 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest transition-all hover:scale-110 active:scale-95">
                                        Criar Conta
                                    </button>
                                    <button type="button" onClick={() => setMostrarModalAdicao(false)} className="px-6 bg-neutral-100 dark:bg-zinc-800 font-black py-4 rounded-xl uppercase text-xs tracking-widest transition-all hover:scale-110 active:scale-95">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}