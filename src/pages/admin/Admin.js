import React from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
            {/* CABEÇALHO DO PAINEL */}
            <header className="mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl">
                        🛠️ 
                    </span>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-0 tracking-tight uppercase">
                            Painel Administrativo
                        </h1>
                        <p className="text-1 text-orange-700 dark:text-orange-400 font-medium mt-0">
                            Bem-vindo à central de inteligência. Gerencie conteúdos, usuários e infraestrutura
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* CARD: CONTEÚDO */}
                <Link to="/admin/conteudo" className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl hover:shadow-xl hover:border-orange-400/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block">📝</span>
                        <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-400 group-hover:text-orange-400 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter mb-1">Conteúdo</h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
                        Edite textos da home, gerencie dicas de preparo e receitas exclusivas.
                    </p>
                </Link>

                {/* CARD: ITENS */}
                <Link to="/admin/item" className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block">⚙️</span>
                        <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-400 group-hover:text-blue-500 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter mb-1">Itens e Cálculo</h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
                        Configure gramaturas, carnes, bebidas e acompanhamentos do sistema.
                    </p>
                </Link>

                {/* CARD: IPS */}
                <Link to="/admin/ips" className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl hover:shadow-xl hover:border-red-500/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block">💻</span>
                        <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-400 group-hover:text-red-500 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter mb-1">Segurança e IPs</h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
                        Gerencie bloqueios de segurança e liberação de acessos por IP.
                    </p>
                </Link>

                {/* CARD: USUÁRIOS */}
                <Link to="/admin/usuarios" className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block">👥</span>
                        <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-400 group-hover:text-emerald-500 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter mb-1">Usuários</h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
                        Controle níveis de acesso, permissões de admin e visualize perfis.
                    </p>
                </Link>

                {/* CARD: RELATÓRIOS */}
                <Link to="/admin/relatorio" className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-xl hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block">📊</span>
                        <span className="bg-neutral-100 dark:bg-zinc-800 text-neutral-400 group-hover:text-purple-500 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter mb-1">Relatórios</h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
                        Analise estatísticas de uso, cálculos gerados e tráfego do app.
                    </p>
                </Link>

                {/* CARD DE PLACEHOLDER PARA FUTURAS FUNÇÕES */}
                <div className="bg-neutral-50 dark:bg-zinc-800/20 p-6 rounded-xl border border-dashed border-neutral-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center opacity-60">
                    <span className="text-3xl mb-2">🚀</span>
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Em breve novas funções</p>
                </div>

            </div>
        </div>
    );
}