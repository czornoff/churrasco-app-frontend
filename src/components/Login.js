import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
    const location = useLocation();
    const mensagemDeErro = location.state?.mensagem;

    const [isRegistro, setIsRegistro] = useState(false);
    const [formData, setFormData] = useState({ nome: '', email: '', password: '' });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        const endpoint = isRegistro ? '/auth/register' : '/auth/login-manual';
        
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include' 
            });

            const data = await res.json();

            if (res.ok) {
                if (isRegistro) {
                    setMensagem({ texto: "Conta criada! Agora faça login.", tipo: 'sucesso' });
                    setIsRegistro(false);
                } else {
                    window.location.href = '/calculodechurrasco';
                }
            } else {
                setMensagem({ texto: data.message || "Erro na autenticação", tipo: 'erro' });
            }
        } catch (err) {
            setMensagem({ texto: "Erro ao conectar com o servidor", tipo: 'erro' });
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 bg-neutral-50 dark:bg-zinc-950 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 border border-neutral-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-white mb-6">
                    {isRegistro ? 'Criar Conta' : 'Acesso Restrito'}
                </h2>

                {mensagemDeErro && (
                    <div className="flex items-center gap-2 w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-400 p-4 rounded-xl text-sm mb-6 animate-in fade-in zoom-in-95">
                        <span className="text-lg">⚠️</span>
                        <span>Faça <strong>login</strong> para liberar o acesso total ao app.</span>
                    </div>
                )}
                
                <button 
                    onClick={handleGoogleLogin} 
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 font-semibold py-3 px-4 rounded-xl transition-all shadow-xl active:scale-[0.98]"
                >
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                        alt="Google" className="w-5" 
                    />
                    {isRegistro ? 'Cadastrar com Google' : 'Entrar com Google'}
                </button>

                <div className="relative my-8 text-center">
                    <hr className="border-neutral-200 dark:border-zinc-700" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-3 text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-widest">
                        ou use seu e-mail
                    </span>
                </div>

                {mensagem.texto && (
                    <div className={`p-4 rounded-xl text-sm mb-6 text-center animate-in slide-in-from-top-2 ${
                        mensagem.tipo === 'erro' 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30' 
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30'
                    }`}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistro && (
                        <input 
                            name="nome"
                            type="text" 
                            placeholder="Nome completo" 
                            required 
                            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-primary-400 transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-600"
                            onChange={handleChange}
                        />
                    )}
                    <input 
                        name="email"
                        type="email" 
                        placeholder="E-mail" 
                        required 
                        className="w-full p-3 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-primary-400 transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-600"
                        onChange={handleChange}
                    />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Senha" 
                        required 
                        className="w-full p-3 rounded-xl border border-neutral-200 dark:border-zinc-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-primary-400 transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-600"
                        onChange={handleChange}
                    />
                    <button 
                        type="submit" 
                        className="w-full py-3 rounded-xl transition-all shadow-xl mt-2
                        bg-primary-700 hover:bg-primary-400 text-white text-lg font-black hover:scale-110 active:scale-95 text-center no-underline"
                    >
                        {isRegistro ? 'Finalizar Cadastro' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-zinc-400">
                        {isRegistro ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                        <span 
                            onClick={() => setIsRegistro(!isRegistro)} 
                            className="ml-1 text-primary-700 dark:text-primary-400 font-bold cursor-pointer hover:underline"
                        >
                            {isRegistro ? ' Faça Login' : ' Cadastre-se'}
                        </span>
                    </p>
                    <a 
                        href="/calculodechurrasco" 
                        className="block text-xs text-neutral-400 dark:text-zinc-500 hover:text-neutral-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        ← Voltar para a Calculadora
                    </a>
                </div>
            </div>
        </div>
    );
}