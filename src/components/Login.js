import React, { useState } from 'react';

export default function Login({ setAuth }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    if (user === process.env.REACT_APP_ADMIN_USER && pass === process.env.REACT_APP_ADMIN_PASS) {
      setAuth(true);
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '350px', margin: '0 auto', background: '#f4f4f4', padding: '30px', borderRadius: '10px' }}>
        <h2>🔒 Área Administrativa</h2>
        <input type="text" placeholder="Usuário" onChange={e => setUser(e.target.value)} 
               style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Senha" onChange={e => setPass(e.target.value)} 
               style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
          ENTRAR
        </button>
      </div>
    </div>
  );
}