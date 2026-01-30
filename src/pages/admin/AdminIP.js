import React, { useEffect, useState } from 'react';

export default function AdminIP({ limite }) {
    const [ips, setIps] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const carregarIps = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/ips`, { credentials: 'include' });
                const data = await res.json();
                setIps(data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar IPs:", err);
                setLoading(false);
            }
        };

        carregarIps();
    }, [API_URL]);
/**
 * Função para deletar um IP do banco de dados.
 * 
 * @param {string} id - ID do IP a ser deletado.
 * 
 * @returns {Promise<void>} Promessa que resolve com void.
 */

    const deletarIP = async (id) => {
        if (!window.confirm(`⚠️ Deseja realmente liberar este endereço? Isso permitirá mais ${limite} consultas gratuitas para este IP.`)) return;
        
        const res = await fetch(`${API_URL}/admin/ips/${id}`, { 
            method: 'DELETE', 
            credentials: 'include' 
        });
        
        if (res.ok) {
            setIps(ips.filter(ip => ip._id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Escaneando rede...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {/* CABEÇALHO DO PAINEL */}
            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        💻
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-0 tracking-tight uppercase">
                            Segurança e IPs
                        </h1>
                        <p className="text-1 text-orange-700 dark:text-orange-400 font-medium mt-0">
                            Gerencie bloqueios de segurança e liberação de acessos por IP após <span className="text-red-600 font-bold">{limite} consultas</span> não autenticadas
                        </p>
                    </div>
                </div>
            </header>
            <div className="bg-neutral-100 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-neutral-200 dark:border-zinc-700 mt-2">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total de Bloqueios</p>
                <p className="text-xl font-black text-neutral-900 dark:text-white leading-none">{ips.length}</p>
            </div>


                

            
            <section className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl mt-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-zinc-800/50 text-neutral-400 text-[10px] uppercase font-black tracking-widest border-b border-neutral-200 dark:border-zinc-800">
                                <th className="px-6 py-4">Endereço IP</th>
                                <th className="px-6 py-4">Status de Uso</th>
                                <th className="px-6 py-4">Primeiro Acesso</th>
                                <th className="px-6 py-4 text-right">Ação Corretiva</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                            {ips.map(ip => (
                                <tr key={ip._id} className="hover:bg-red-50/30 dark:hover:bg-red-900/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <code className="bg-neutral-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono text-sm font-bold text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-700">
                                                {ip.ip}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="w-full max-w-[100px] h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-red-600" 
                                                    style={{ width: `${(ip.consultas / limite) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-neutral-400">
                                                {ip.consultas} / {limite} Consultas
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-neutral-500 uppercase">
                                            {new Date(ip.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => deletarIP(ip._id)}
                                            className="bg-green-600  text-white hover:bg-green-900 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all active:scale-95 hover:scale-110"
                                        >
                                            🗑️ Liberar Acesso
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {ips.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/50 dark:bg-zinc-900/50 text-neutral-400">
                        <span className="text-4xl mb-2">🛡️</span>
                        <p className="font-black uppercase tracking-widest text-[10px]">Nenhum IP bloqueado no momento.</p>
                        <p className="text-xs font-medium">O sistema está operando dentro dos limites normais.</p>
                    </div>
                )}
            </section>

            <footer className="mt-6 p-6 bg-orange-50 dark:bg-orange-700/10 rounded-xl border border-orange-400 dark:border-orange-700/20">
                <div className="flex items-start gap-4">
                    <span className="text-xl">💡</span>
                    <div>
                        <h4 className="text-sm font-black text-orange-700 dark:text-orange-400 uppercase tracking-tight">Dica de Administração</h4>
                        <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                            A liberação manual de um IP é útil para usuários legítimos que esqueceram de fazer login. 
                            Recomende sempre a criação de conta para consultas ilimitadas.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}