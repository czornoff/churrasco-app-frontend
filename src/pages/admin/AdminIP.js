import React, { useEffect, useState } from 'react';

export default function AdminIP({ styles, adminStyles }) {
    const [ips, setIps] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const carregarIps = async () => {
        const res = await fetch(`${API_URL}/admin/ips`, { credentials: 'include' });
        const data = await res.json();
        setIps(data);
    };

    useEffect(() => { carregarIps(); }, []);

    const deletarIP = async (id) => {
        if (!window.confirm("Liberar este IP para mais 5 consultas gratuitas?")) return;
        
        const res = await fetch(`${API_URL}/admin/ips/${id}`, { 
            method: 'DELETE', 
            credentials: 'include' 
        });
        
        if (res.ok) {
            setIps(ips.filter(ip => ip._id !== id));
            alert("IP liberado!");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.modalHeader}>Gerenciar Bloqueios de IP</h2>
            <p>Lista de visitantes que utilizaram o limite de consultas.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>IP</th>
                        <th style={{ padding: '10px' }}>Consultas</th>
                        <th style={{ padding: '10px' }}>Último Acesso</th>
                        <th style={{ padding: '10px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {ips.map(ip => (
                        <tr key={ip._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{ip.ip}</td>
                            <td style={{ padding: '10px' }}>{ip.consultas} / 2</td>
                            <td style={{ padding: '10px' }}>{new Date(ip.createdAt).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>
                                <button 
                                    onClick={() => deletarIP(ip._id)}
                                    style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Remover Bloqueio
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}