import React, { useState } from 'react';

const Receitas = ({ dados }) => {
    const [receitaAtiva, setReceitaAtiva] = useState(null);

    if (!dados) return (
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

    const listaReceitas = dados.itens || [];

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 transition-colors duration-300">
                <header className="text-center mb-16">
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight uppercase">
                        {dados.titulo || "Receitas de Sucesso"}
                    </h1>
                    <p className="text-lg md:text-xl text-orange-700 dark:text-orange-400 font-medium">
                        {dados.subtitulo || "Acompanhamentos e preparos especiais"}
                    </p>
                    <div className="w-24 h-1.5 bg-orange-700 mx-auto mt-6 rounded-full"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listaReceitas.map((r, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col bg-neutral-50 dark:bg-zinc-800/70 rounded-xl p-8 border border-neutral-200 dark:border-zinc-800 shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl">{r.icone || '🍳'}</span>
                                <h3 className="text-xl font-bold text-neutral-800 dark:text-zinc-100 leading-tight">
                                    {r.titulo}
                                </h3>
                            </div>
                            
                            <div className="flex gap-4 text-xs font-bold text-neutral-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">
                                <span className="flex items-center gap-1">⏱ {r.tempo || 'N/A'}</span>
                                <span className="flex items-center gap-1">📊 {r.nivel || 'Fácil'}</span>
                            </div>

                            <button 
                                className="w-full max-w-sm bg-orange-700 hover:bg-orange-400 text-white text-l font-black py-2 rounded-xl transition-all shadow-xl hover:scale-110 active:scale-95 text-center no-underline"
                                onClick={() => setReceitaAtiva(r)}
                            >
                                Ver Receita
                            </button>
                        </div>
                    ))}
                </div>

                {/* MODAL DE DETALHES */}
                {receitaAtiva && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setReceitaAtiva(null)}
                    >
                        <div 
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-xl animate-in zoom-in-95 duration-300"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 dark:text-zinc-500 dark:hover:text-white text-2xl"
                                onClick={() => setReceitaAtiva(null)}
                            >
                                ✕
                            </button>
                            
                            <h2 className="text-3xl font-black text-neutral-800 dark:text-white mb-6 pr-8">
                                {receitaAtiva.titulo}
                            </h2>
                            
                            <div className="flex gap-6 mb-8 py-4 border-y border-neutral-200 dark:border-zinc-800 text-sm">
                                <span className="text-neutral-600 dark:text-zinc-400">⏱ <strong>Tempo:</strong> {receitaAtiva.tempo}</span>
                                <span className="text-neutral-600 dark:text-zinc-400">📊 <strong>Nível:</strong> {receitaAtiva.nivel}</span>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <h4 className="text-orange-700 dark:text-orange-400 font-bold uppercase tracking-widest text-sm mb-4">
                                        🛒 Ingredientes
                                    </h4>
                                    <p className="whitespace-pre-line text-neutral-700 dark:text-zinc-300 leading-relaxed bg-neutral-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800">
                                        {Array.isArray(receitaAtiva.ingredientes) 
                                            ? receitaAtiva.ingredientes.join('\n') 
                                            : receitaAtiva.ingredientes || ''}
                                    </p>
                                </section>

                                <section>
                                    <h4 className="text-orange-700 dark:text-orange-400 font-bold uppercase tracking-widest text-sm mb-4">
                                        👨‍🍳 Modo de Preparo
                                    </h4>
                                    <div 
                                        className="prose prose-neutral dark:prose-invert max-w-none 
                                                prose-p:text-neutral-700 dark:prose-p:text-zinc-300 
                                                prose-li:text-neutral-700 dark:prose-li:text-zinc-300 dark:text-zinc-300"
                                        dangerouslySetInnerHTML={{ __html: receitaAtiva.preparo || '<p>Instruções em breve...</p>' }} 
                                    />
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {listaReceitas.length === 0 && (
                    <p className="text-center mt-12 text-neutral-500 dark:text-zinc-500">
                        Nenhuma receita cadastrada no momento.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Receitas;