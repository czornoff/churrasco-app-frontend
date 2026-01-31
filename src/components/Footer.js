import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Footer({ dados }) {
    return (
        <footer className="bg-neutral-900 text-neutral-300 dark:bg-zinc-950 dark:text-zinc-400 pt-10 mt-16 border-t-4 border-primary-700 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between px-5 gap-8">
                
                {/* Coluna 1: Logo e Descrição */}
                <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-4">
                        <img 
                            src={dados.logoUrl ? `${API_URL}${dados.logoUrl}` : '/logos/logo.png'}
                            alt={dados.nomeApp} 
                            className="h-9 w-auto"
                        />
                        <span className="text-primary-700 text-xl font-bold uppercase tracking-wider leading-tight">
                            {dados.nomeApp}
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4">
                        A solução inteligente para organizar seu churrasco sem desperdícios.
                    </p>
                    <nav className="flex flex-col gap-2">
                        <a 
                            href="https://mandebem.com/politicadeprivacidade.html" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm hover:text-primary-400 transition-colors"
                        >
                            Política de Privacidade
                        </a>
                    </nav>
                </div>

                {/* Coluna 2: Navegação */}
                <div className="flex-1 min-w-[250px]">
                    <h4 className="text-white dark:text-zinc-100 text-base mb-4 uppercase font-semibold">
                        Links Úteis
                    </h4>
                    <nav className="flex flex-col gap-2">
                        <Link to="/calculadora" className="text-sm hover:text-primary-400 transition-colors">Calculadora</Link>
                        <Link to="/dicas" className="text-sm hover:text-primary-400 transition-colors">Dicas de Mestre</Link>
                        <Link to="/produtos" className="text-sm hover:text-primary-400 transition-colors">Produtos</Link>
                        <Link to="/receitas" className="text-sm hover:text-primary-400 transition-colors">Receitas</Link>
                        <Link to="/sobre" className="text-sm hover:text-primary-400 transition-colors">Sobre Nós</Link>
                    </nav>
                </div>

                {/* Coluna 3: Contato/Social */}
                <div className="flex-1 min-w-[250px]">
                    <h4 className="text-white dark:text-zinc-100 text-base mb-4 uppercase font-semibold">
                        Contato
                    </h4>
                    <a 
                        href={`mailto:${dados.email}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary-700 font-bold text-sm hover:underline"
                    >
                        {dados.email}
                    </a>
                    <div className="mt-25 text-sm leading-relaxed">
                        <a 
                            href={dados.instagram} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-primary-700 font-bold hover:underline"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800 dark:border-zinc-800 mt-10 p-5 text-center">
                <p className="text-xs text-neutral-500 dark:text-zinc-500 m-0 leading-relaxed">
                    © {new Date().getFullYear()} {dados.nomeApp} - Desenvolvido por{' '}
                    <a 
                        href='https://www.zornoff.com.br' 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary-700 font-bold hover:underline"
                    >
                        Zornoff
                    </a>.
                </p>
            </div>
        </footer>
    );
}