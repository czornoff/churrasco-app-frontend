import React, { useState } from 'react';
import { loginStyles as styles } from '../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
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
                    window.location.href = '/';
                }
            } else {
                setMensagem({ texto: data.message || "Erro na autenticação", tipo: 'erro' });
            }
        } catch (err) {
            setMensagem({ texto: "Erro ao conectar com o servidor", tipo: 'erro' });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.titulo}>{isRegistro ? 'Criar Conta' : 'Acesso Restrito'}</h2>
                
                <button onClick={handleGoogleLogin} style={styles.googleBtn}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                        alt="Google" style={{ width: '18px' }} 
                    />
                    {isRegistro ? 'Cadastrar com Google' : 'Entrar com Google'}
                </button>

                <div style={styles.divisor}>
                    <span style={styles.divisorTexto}>ou use seu e-mail</span>
                </div>

                {mensagem.texto && (
                    <div style={{ 
                        ...styles.alerta, 
                        backgroundColor: mensagem.tipo === 'erro' ? '#ffebee' : '#e8f5e9', 
                        color: mensagem.tipo === 'erro' ? '#c62828' : '#2e7d32' 
                    }}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {isRegistro && (
                        <input 
                            name="nome"
                            type="text" 
                            placeholder="Nome completo" 
                            required 
                            style={styles.input} 
                            onChange={handleChange}
                        />
                    )}
                    <input 
                        name="email"
                        type="email" 
                        placeholder="E-mail" 
                        required 
                        style={styles.input} 
                        onChange={handleChange}
                    />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Senha" 
                        required 
                        style={styles.input} 
                        onChange={handleChange}
                    />
                    <button type="submit" style={styles.submitBtn}>
                        {isRegistro ? 'Finalizar Cadastro' : 'Entrar'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.toggleText}>
                        {isRegistro ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                        <span 
                            onClick={() => setIsRegistro(!isRegistro)} 
                            style={styles.toggleLink}
                        >
                            {isRegistro ? ' Faça Login' : ' Cadastre-se'}
                        </span>
                    </p>
                    <a href="/" style={styles.backLink}>← Voltar para a Calculadora</a>
                </div>
            </div>
        </div>
    );
}