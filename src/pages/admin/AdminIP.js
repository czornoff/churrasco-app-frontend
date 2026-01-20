import React, { useEffect, useState } from 'react';

export default function AdminIP({ styles, adminStyles, limite }) {
    const [ips, setIps] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Função definida dentro para evitar avisos de dependência
        const carregarIps = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/ips`, { credentials: 'include' });
                const data = await res.json();
                setIps(data);
            } catch (err) {
                console.error("Erro ao carregar IPs:", err);
            }
        };

        carregarIps();
    }, [API_URL]);

    const deletarIP = async (id) => {
        if (!window.confirm(`Liberar este IP para mais ${limite} consultas gratuitas?`)) return;
        const res = await fetch(`${API_URL}/admin/ips/${id}`, { 
            method: 'DELETE', 
            credentials: 'include' 
        });
        if (res.ok) {
            setIps(ips.filter(ip => ip._id !== id));
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>🚫 IPs Bloqueados</h1>
                <p style={{ color: '#666' }}>Visitantes que atingiram o limite de {limite} consultas.</p>
            </header>
            
            <section style={styles.contentWrapper}>
                <table style={adminStyles.table}>
                    <thead style={adminStyles.thead}>
                        <tr style={adminStyles.tr}>
                            <th>IP</th>
                            <th>Consultas</th>
                            <th>Último Acesso</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody style={adminStyles.tbody}>
                        {ips.map(ip => (
                            <tr key={ip._id} style={adminStyles.tr}>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>IP:</span>
                                    <code>{ip.ip}</code>
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Uso:</span>
                                    {ip.consultas} / {limite}
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Data:</span>
                                    {new Date(ip.createdAt).toLocaleString('pt-BR')}
                                </td>
                                <td style={adminStyles.tdAcoes}>
                                    <button 
                                        onClick={() => deletarIP(ip._id)}
                                        style={{...styles.btnView, backgroundColor: '#d9534f'}}
                                    >
                                        🗑️ Liberar IP
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ips.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>Nenhum IP bloqueado no momento.</p>}
            </section>
        </div>
    );
}