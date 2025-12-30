import React, { useState } from 'react';

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

// Os estilos permanecem os mesmos que você já tem...
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f5f5f5' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '380px', width: '90%' },
    titulo: { color: '#333', marginBottom: '20px', fontSize: '24px' },
    googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #dadce0', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#3c4043', marginBottom: '15px' },
    divisor: { borderBottom: '1px solid #eee', lineHeight: '0.1em', margin: '20px 0' },
    divisorTexto: { background: '#fff', padding: '0 10px', color: '#999', fontSize: '13px' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' },
    submitBtn: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#e53935', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
    alerta: { padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' },
    footer: { marginTop: '20px', fontSize: '14px' },
    toggleText: { color: '#666', marginBottom: '15px' },
    toggleLink: { color: '#e53935', fontWeight: 'bold', cursor: 'pointer' },
    backLink: { color: '#999', textDecoration: 'none', display: 'block', marginTop: '10px' }
};