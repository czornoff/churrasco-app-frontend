import React from 'react';

export default function Items({ dados }) {
    // Caso o conteúdo ainda não tenha sido populado no banco
    if (!dados || !dados.itens) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-neutral-500 dark:text-zinc-400 font-medium">
                Nenhum dado cadastrado ainda. 🔥
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 transition-colors duration-300">
                <header className="text-center mb-16">
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight uppercase">
                        {dados.titulo || 'Dicas de Mestre'}
                    </h1>
                    <p className="text-lg md:text-xl text-orange-700 dark:text-orange-400 font-medium">
                        {dados.subtitulo || 'Truques para o churrasco perfeito'}
                    </p>
                    <div className="w-24 h-1.5 bg-orange-700 mx-auto mt-6 rounded-full"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dados.itens.map((item, index) => (
                        <div 
                            key={index} 
                            className="group bg-neutral-50 dark:bg-zinc-800/70 rounded-xl p-8 border border-neutral-200 dark:border-zinc-800 shadow-xl  transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                                    {item.icone || '💡'}
                                </span>
                                <h3 className="text-xl font-bold text-neutral-800 dark:text-zinc-100 leading-tight">
                                    {item.titulo}
                                </h3>
                            </div>
                            
                            <div 
                                className="prose prose-neutral dark:prose-invert max-w-none 
                                        prose-p:text-neutral-600 dark:prose-p:text-zinc-400 
                                        prose-p:leading-relaxed prose-strong:text-orange-700
                                        dark:prose-strong:text-orange-400 prose-sm dark:text-zinc-300"
                                dangerouslySetInnerHTML={{ __html: item.texto || '<p>Dica em breve...</p>' }} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}