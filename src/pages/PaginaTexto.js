import React from 'react';
import { Link } from 'react-router-dom';

export default function PaginaTexto({ titulo, texto }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!titulo && !texto) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-neutral-50 dark:bg-zinc-950 transition-colors">
                <div className="text-6xl mb-6 animate-bounce">🔥</div>
                <h2 className="text-2xl font-black text-primary-700 dark:text-primary-400 mb-2 uppercase">
                    Preparando a brasa...
                </h2>
                <p className="text-neutral-500 dark:text-zinc-400 font-medium animate-pulse">
                    Carregando Relatórios de Inteligência
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 transition-colors duration-300">
                <header className="flex flex-col items-center text-center mb-12">
                    <h1 className="text-3xl font-black text-neutral-800 dark:text-white leading-tight uppercase tracking-tighter">
                        {titulo || ''}
                    </h1>
                    <div className="mt-8 w-full flex justify-center">
                        <Link 
                            to="/calculadora" 
                            className="w-full max-w-sm bg-primary-700 hover:bg-primary-400 text-white text-lg font-black py-5 rounded-xl transition-all shadow-xl hover:scale-110 active:scale-95 text-center no-underline"
                        >
                            🔥 CALCULE AGORA! 🔥
                        </Link>
                    </div>
                </header>

                {/* Bloco de conteúdo com reset de estilos do Tailwind */}
                <div className="bg-neutral-50 dark:bg-zinc-800/70 p-6 md:p-10 rounded-xl border border-neutral-200 dark:border-zinc-700 shadow-xl dark:text-zinc-300">
                    
                    {/* Estilo local para garantir que o HTML do banco apareça corretamente */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .conteudo-customizado h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
                        .conteudo-customizado h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
                        .conteudo-customizado h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
                        .conteudo-customizado p { margin-bottom: 1em; line-height: 1.6; }
                        .conteudo-customizado ul { list-style-type: disc; padding-left: 40px; margin-bottom: 1em; }
                        .conteudo-customizado ol { list-style-type: decimal; padding-left: 40px; margin-bottom: 1em; }
                        .conteudo-customizado strong { font-weight: bold; }
                        .conteudo-customizado em { font-style: italic; }
                        .conteudo-customizado img { max-width: 100%; height: auto; border-radius: 8px; }
                        .conteudo-customizado a { color: #ea580c; text-decoration: underline; }
                    `}} />

                    <div 
                        className="conteudo-customizado"
                        dangerouslySetInnerHTML={{ __html: texto || '' }} 
                    />
                </div>
            </div>
        </div>
    );
}