import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminRelatorio() {
    const [dados, setDados] = useState({ logs: [], estatisticas: {} });
    const [loading, setLoading] = useState(true);
    const [logSelecionado, setLogSelecionado] = useState(null);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [logsFiltrados, setLogsFiltrados] = useState([]);

    const temFiltroAtivo = filtroUsuario !== '' || filtroDataInicio !== '' || filtroDataFim !== '';
    const listaUsuariosUnicos = [...new Set(dados.logs.map(log => log.usuarioId?.nome || 'Anônimo'))].sort();

    const totalCalculosFiltrados = logsFiltrados.length;
    const totalPessoasFiltradas = logsFiltrados.reduce((acc, log) => {
        const somaLog = (log.participantes.homens || 0) + 
                        (log.participantes.mulheres || 0) + 
                        (log.participantes.criancas || 0);
        return acc + somaLog;
    }, 0);

    useEffect(() => {
        fetch(`${API_URL}/admin/relatorio`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setDados(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let resultado = dados.logs;

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
        <div className="flex flex-col h-screen justify-center items-center bg-neutral-50 dark:bg-zinc-950">
            <div className="text-6xl animate-bounce mb-4">🔥</div>
            <h2 className="text-2xl font-black text-primary-700 uppercase tracking-tighter">Preparando a brasa...</h2>
            <p className="text-neutral-500 font-bold animate-pulse">Carregando Relatórios</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {/* CABEÇALHO DO PAINEL */}
            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        📊
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-0 tracking-tight uppercase">
                            Relatórios
                        </h1>
                        <p className="text-1 text-primary-700 dark:text-primary-400 font-medium mt-0">
                            Analise estatísticas de uso, cálculos gerados e tráfego do app
                        </p>
                    </div>
                </div>
            </header>

            {/* MÉTRICAS DE DESTAQUE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-600 rounded-xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Total de Cálculos</p>
                        <h2 className="text-5xl font-black tracking-tighter flex items-center gap-2">
                            {totalCalculosFiltrados}
                            {temFiltroAtivo && <span className="text-xs bg-white/20 px-2 py-1 rounded text-white italic">Filtrado</span>}
                        </h2>
                    </div>
                    <span className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">📈</span>
                </div>

                <div className="bg-emerald-600 rounded-xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Pessoas Impactadas</p>
                        <h2 className="text-5xl font-black tracking-tighter flex items-center gap-2">
                            {totalPessoasFiltradas}
                            {temFiltroAtivo && <span className="text-xs bg-white/20 px-2 py-1 rounded text-white italic">Filtrado</span>}
                        </h2>
                    </div>
                    <span className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">🤝</span>
                </div>
            </div>

            {/* FILTROS */}
            <section className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-6 mb-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Buscar Usuário</label>
                        <input 
                            type="text" list="usuarios-list" placeholder="Nome do usuário..." 
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold text-sm"
                            value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}
                        />
                        <datalist id="usuarios-list">
                            {listaUsuariosUnicos.map((nome, index) => <option key={index} value={nome} />)}
                        </datalist>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Data Início</label>
                        <input type="date" className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold text-sm"
                            value={filtroDataInicio} onChange={(e) => setFiltroDataInicio(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase ml-1">Data Fim</label>
                        <input type="date" className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-zinc-800 border-none font-bold text-sm"
                            value={filtroDataFim} onChange={(e) => setFiltroDataFim(e.target.value)} />
                    </div>
                    <button 
                        onClick={() => { setFiltroUsuario(''); setFiltroDataInicio(''); setFiltroDataFim(''); }}
                        className="bg-red-500 hover:bg-red-800 text-white font-black py-3 rounded-xl uppercase text-sm transition-all
                        hover:scale-110 active:scale-95"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </section>

            {/* TABELA DE RESULTADOS */}
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-tighter text-lg">Histórico de Consultas ({logsFiltrados.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-zinc-800/50 text-neutral-400 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-6 py-4">Data/Hora</th>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4 text-center">Participantes</th>
                                <th className="px-6 py-4 text-center">Itens</th>
                                <th className="px-6 py-4 text-center">Tempo</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                            {logsFiltrados.map(log => (
                                <tr key={log._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-neutral-600 dark:text-zinc-300">
                                        {new Date(log.dataConsulta).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 font-black uppercase tracking-tighter text-primary-700">
                                        {log.usuarioId?.nome || 'Anônimo'}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex justify-center gap-2 text-xs font-bold bg-neutral-100 dark:bg-zinc-800 p-2 rounded-xl">
                                            <span>🧔{log.participantes.homens}</span>
                                            <span>👩{log.participantes.mulheres}</span>
                                            <span>👶{log.participantes.criancas}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-neutral-400">
                                        {log.itensSelecionados.length}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 font-black px-2 py-1 rounded uppercase">
                                            {log.horasDuracao}h
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setLogSelecionado(log)}
                                            className=" bg-primary-700 hover:bg-primary-400 text-white text-sm font-black px-4 py-2 rounded-xl uppercase dark:hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
                                        >
                                            👁️ Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE DETALHES DA LISTA */}
            {logSelecionado && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setLogSelecionado(null)}>
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Lista Gerada</h3>
                                <p className="text-xs text-neutral-500 font-bold">{logSelecionado.usuarioId?.nome || 'Anônimo'} em {new Date(logSelecionado.dataConsulta).toLocaleString('pt-BR')}</p>
                            </div>
                            <button onClick={() => setLogSelecionado(null)} className="text-neutral-300 hover:text-red-500 text-3xl transition-colors">×</button>
                        </div>
                        
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {logSelecionado.resultadoFinal.map((item, idx) => {
                                    const isObs = item.subtipo === 'observacao';
                                    return (
                                        <div key={idx} className={`flex justify-between items-center p-3 rounded-xl ${isObs ? 'bg-primary-50 dark:bg-primary-700/10 border border-primary-400 dark:border-primary-700/30' : 'bg-neutral-50 dark:bg-zinc-800'}`}>
                                            <span className={`font-bold text-sm ${isObs ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-zinc-300'}`}>
                                                {item.nome}
                                            </span>
                                            <strong className={`font-black uppercase text-sm ${isObs ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-900 dark:text-white'}`}>
                                                {item.quantidade}
                                            </strong>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-6 bg-neutral-50 dark:bg-zinc-800/50 flex justify-center">
                            <button onClick={() => setLogSelecionado(null)} 
                            className="w-full  bg-primary-700 hover:bg-primary-400 text-white font-black py-4 rounded-xl uppercase text-s tracking-widest transition-all hover:scale-110 active:scale-95">
                                Fechar Relatório
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}