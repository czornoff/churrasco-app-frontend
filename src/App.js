import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculadora from './pages/Calculadora';
import AdminPanel from './pages/Admin';
import Login from './components/Login';

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
  const [opcoes, setOpcoes] = useState(null);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/opcoes`).then(res => res.json()).then(data => setOpcoes(data));
  }, []);

  if (!opcoes) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando dados...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculadora opcoes={opcoes} />} />
        <Route 
          path="/admin" 
          element={autenticado ? <AdminPanel opcoes={opcoes} setOpcoes={setOpcoes} /> : <Login setAuth={setAutenticado} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}