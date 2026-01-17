import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login({loginStyles}) {
    const [isRegistro, setIsRegistro] = useState(false);
    const [formData, setFormData] = useState({ nome: '', email: '', password: '' });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

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
                // ADICIONADO: Essencial para Cross-Origin (3000 -> 3001) funcionar com sessões
                credentials: 'include' 
            });

            const data = await res.json();

            if (res.ok) {
                if (isRegistro) {
                    setMensagem({ texto: "Conta criada! Agora faça login.", tipo: 'sucesso' });
                    setIsRegistro(false);
                } else {
                    // Login manual bem sucedido: Redireciona para a home
                    // O App.js agora conseguirá ler o cookie pois usamos 'credentials'
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
        <div style={loginStyles.container}>
            <div style={loginStyles.card}>
                <h2 style={loginStyles.titulo}>{isRegistro ? 'Criar Conta' : 'Acesso Restrito'}</h2>
                
                <button onClick={handleGoogleLogin} style={loginStyles.googleBtn}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                        alt="Google" style={{ width: '18px' }} 
                    />
                    {isRegistro ? 'Cadastrar com Google' : 'Entrar com Google'}
                </button>

                <div style={loginStyles.divisor}>
                    <span style={loginStyles.divisorTexto}>ou use seu e-mail</span>
                </div>

                {mensagem.texto && (
                    <div style={{ 
                        ...loginStyles.alerta, 
                        ...(mensagem.tipo === 'erro' ? loginStyles.erro : loginStyles.sucesso) 
                    }}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={loginStyles.form}>
                    {isRegistro && (
                        <input 
                            name="nome"
                            type="text" 
                            placeholder="Nome completo" 
                            required 
                            style={loginStyles.input} 
                            onChange={handleChange}
                        />
                    )}
                    <input 
                        name="email"
                        type="email" 
                        placeholder="E-mail" 
                        required 
                        style={loginStyles.input} 
                        onChange={handleChange}
                    />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Senha" 
                        required 
                        style={loginStyles.input} 
                        onChange={handleChange}
                    />
                    <button type="submit" style={loginStyles.submitBtn}>
                        {isRegistro ? 'Finalizar Cadastro' : 'Entrar'}
                    </button>
                </form>

                <div style={loginStyles.footer}>
                    <p style={loginStyles.toggleText}>
                        {isRegistro ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                        <span 
                            onClick={() => setIsRegistro(!isRegistro)} 
                            style={loginStyles.toggleLink}
                        >
                            {isRegistro ? ' Faça Login' : ' Cadastre-se'}
                        </span>
                    </p>
                    <a href="/calculodechurrasco" style={loginStyles.backLink}>← Voltar para a Calculadora</a>
                </div>
            </div>
        </div>
    );
}