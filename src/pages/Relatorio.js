import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Relatorio({ usuario }) {
    const { id } = useParams(); 
    const [dados, setDados] = useState({ logs: [], estatisticas: {} });
    const [loading, setLoading] = useState(true);
    const [logSelecionado, setLogSelecionado] = useState(null);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [logsFiltrados, setLogsFiltrados] = useState([]);

    const temFiltroAtivo = filtroUsuario !== '' || filtroDataInicio !== '' || filtroDataFim !== '';

    const totalCalculosFiltrados = logsFiltrados.length;
    const totalPessoasFiltradas = logsFiltrados.reduce((acc, log) => {
        const somaLog = (log.participantes.homens || 0) + 
                        (log.participantes.mulheres || 0) + 
                        (log.participantes.criancas || 0);
        return acc + somaLog;
    }, 0);

    useEffect(() => {
        fetch(`${API_URL}/api/relatorio/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setDados(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        let resultado = dados.logs || [];

        if (filtroUsuario) {
            resultado = resultado.filter(log => 
                (log.usuarioId?.nome || 'Anônimo').toLowerCase().includes(filtroUsuario.toLowerCase())
            );
        }

        if (filtroDataInicio) {
            resultado = resultado.filter(log => new Date(log.dataConsulta) >= new Date(filtroDataInicio + "T00:00:00"));
        }
        if (filtroDataFim) {
            resultado = resultado.filter(log => new Date(log.dataConsulta) <= new Date(filtroDataFim + "T23:59:59"));
        }

        setLogsFiltrados(resultado);
    }, [filtroUsuario, filtroDataInicio, filtroDataFim, dados.logs]);

    if (loading) return (
        <div className="h-screen flex flex-col justify-center items-center bg-neutral-50 dark:bg-zinc-950 transition-colors">
            <div className="text-6xl mb-6 animate-bounce">🔥</div>
            <h2 className="text-2xl font-black text-orange-700 dark:text-orange-400 mb-2 uppercase">
                Preparando a brasa...
            </h2>
            <p className="text-neutral-500 dark:text-zinc-400 font-medium animate-pulse">
                Carregando Relatórios de Inteligência
            </p>
        </div>
    );

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-10 transition-colors duration-300">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-800 dark:text-white leading-tight uppercase tracking-tighter">
                            📊 Relatório de Uso
                        </h1>
                        <p className="text-lg md:text-xl text-orange-700 dark:text-orange-400 font-medium">
                            Análise de métricas e conversões do sistema.
                        </p>
                    </div>
                    
                    {/* SEÇÃO DE FILTROS */}
                    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1 mb-1">Início</label>
                            <input 
                                type="date" 
                                value={filtroDataInicio}
                                onChange={(e) => setFiltroDataInicio(e.target.value)}
                                className="bg-neutral-50 dark:bg-zinc-800 border-none rounded-xl text-xs font-bold text-neutral-700 dark:text-white focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1 mb-1">Fim</label>
                            <input 
                                type="date" 
                                value={filtroDataFim}
                                onChange={(e) => setFiltroDataFim(e.target.value)}
                                className="bg-neutral-50 dark:bg-zinc-800 border-none rounded-xl text-xs font-bold text-neutral-700 dark:text-white focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <button 
                            onClick={() => { setFiltroUsuario(''); setFiltroDataInicio(''); setFiltroDataFim(''); }}
                            className="mt-4 px-4 py-2 bg-neutral-200 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-neutral-600 dark:text-zinc-400 hover:text-red-600 rounded-xl text-xs font-black transition-all"
                        >
                            LIMPAR
                        </button>
                    </div>
                </header>

                {/* CARDS DE RESUMO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 px-8 rounded-xl shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">📈</div>
                        <span className="text-blue-100 text-xs font-black uppercase tracking-[0.2em]">Total de Cálculos</span>
                        <h2 className="text-5xl font-black text-white mt-2 italic">
                            {totalCalculosFiltrados}
                            {temFiltroAtivo && <span className="text-sm font-normal ml-2 opacity-70">(filtrado)</span>}
                        </h2>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 px-8 rounded-xl shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">👥</div>
                        <span className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em]">Pessoas Impactadas</span>
                        <h2 className="text-5xl font-black text-white mt-2 italic">
                            {totalPessoasFiltradas}
                            {temFiltroAtivo && <span className="text-sm font-normal ml-2 opacity-70">(filtrado)</span>}
                        </h2>
                    </div>
                </div>

                {/* LISTAGEM DE LOGS */}
                <section className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="font-black text-neutral-800 dark:text-white uppercase tracking-wider text-sm">Registros Recentes ({logsFiltrados.length})</h3>
                        <input 
                            type="text"
                            placeholder="Filtrar por nome..."
                            value={filtroUsuario}
                            onChange={(e) => setFiltroUsuario(e.target.value)}
                            className="text-xs bg-neutral-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 w-48"
                        />
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-zinc-800/50 text-[10px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest">
                                    <th className="px-6 py-4 text-center">Data/Hora</th>
                                    <th className="px-6 py-4">Usuário</th>
                                    <th className="px-6 py-4">Configuração</th>
                                    <th className="px-6 py-4 text-center">Itens</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                {logsFiltrados.map(log => (
                                    <tr key={log._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="text-sm font-bold text-neutral-700 dark:text-zinc-300">
                                                {new Date(log.dataConsulta).toLocaleDateString('pt-BR')}
                                            </div>
                                            <div className="text-[10px] text-neutral-400 font-medium">
                                                {new Date(log.dataConsulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-sm text-neutral-800 dark:text-zinc-200">
                                            {log.usuarioId?.nome || '🔥 Anônimo'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 text-[10px] font-bold">
                                                <span className="bg-orange-400 dark:bg-orange-700/30 text-orange-700 px-2 py-0.5 rounded">🧔 {log.participantes.homens}</span>
                                                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 px-2 py-0.5 rounded">👩 {log.participantes.mulheres}</span>
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded">👶 {log.participantes.criancas}</span>
                                                <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 px-2 py-0.5 rounded">⏱️ {log.horasDuracao}h</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-neutral-700 dark:text-zinc-300">{log.itensSelecionados.length}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => setLogSelecionado(log)}
                                                className="bg-neutral-900 dark:bg-zinc-100 text-white dark:text-neutral-900 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-orange-700 dark:hover:bg-orange-400 hover:text-white transition-all scale-95 hover:scale-100"
                                            >
                                                DETALHES
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* MODAL DE DETALHES */}
                {logSelecionado && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setLogSelecionado(null)}>
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="bg-neutral-900 p-6 flex justify-between items-center">
                                <h3 className="text-white font-black uppercase tracking-tighter">
                                    Lista de {logSelecionado.usuarioId?.nome || 'Anônimo'}
                                </h3>
                                <button onClick={() => setLogSelecionado(null)} className="text-white/50 hover:text-white text-xl">✕</button>
                            </div>
                            
                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="text-[10px] font-black text-neutral-400 uppercase mb-6 tracking-widest border-b pb-2">Itens da Lista</div>
                                <div className="space-y-3">
                                    {logSelecionado.resultadoFinal.map((item, idx) => {
                                        const isObs = item.subtipo === 'observacao';
                                        return (
                                            <div key={idx} className={`flex justify-between items-center py-2 ${isObs ? 'bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border-l-4 border-amber-400' : 'border-b border-neutral-50 dark:border-zinc-800'}`}>
                                                <span className={`text-sm ${isObs ? 'text-amber-800 dark:text-amber-300' : 'font-bold text-neutral-700 dark:text-zinc-300'}`}>
                                                    {item.nome}
                                                </span>
                                                {!isObs && (
                                                    <span className="font-mono text-sm bg-neutral-100 dark:bg-zinc-800 px-2 py-1 rounded font-bold text-neutral-900 dark:text-white">
                                                        {item.quantidade}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="p-6 bg-neutral-50 dark:bg-zinc-800/50">
                                <button 
                                    onClick={() => setLogSelecionado(null)} 
                                    className="w-full bg-neutral-red dark:bg-red-800 text-white dark:text-neutral-900 font-black py-4 rounded-xl hover:bg-orange-700 dark:hover:bg-orange-400 hover:text-white transition-all"
                                >
                                    FECHAR
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}