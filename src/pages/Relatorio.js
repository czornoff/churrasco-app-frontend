import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function Relatorio({ styles, adminStyles }) {
    const { id } = useParams(); // Pega o ID da URL (:id)
    const [dados, setDados] = useState({ logs: [], estatisticas: {} });
    const [loading, setLoading] = useState(true);
    const [logSelecionado, setLogSelecionado] = useState(null);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [logsFiltrados, setLogsFiltrados] = useState([]);

    const temFiltroAtivo = filtroUsuario !== '' || filtroDataInicio !== '' || filtroDataFim !== '';

    const totalCalculosFiltrados = logsFiltrados.length;
    const totalPessoasFiltradas = logsFiltrados.reduce((acc, log) => {
        const somaLog = (log.participantes.homens || 0) + 
                        (log.participantes.mulheres || 0) + 
                        (log.participantes.criancas || 0);
        return acc + somaLog;
    }, 0);

    useEffect(() => {
        fetch(`${API_URL}/api/relatorio/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setDados(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        let resultado = dados.logs;

        if (filtroUsuario) {
            resultado = resultado.filter(log => 
                (log.usuarioId?.nome || 'Anônimo').toLowerCase().includes(filtroUsuario.toLowerCase())
            );
        }

        if (filtroDataInicio) {
            resultado = resultado.filter(log => new Date(log.dataConsulta) >= new Date(filtroDataInicio + "T00:00:00"));
        }
        if (filtroDataFim) {
            resultado = resultado.filter(log => new Date(log.dataConsulta) <= new Date(filtroDataFim + "T23:59:59"));
        }

        setLogsFiltrados(resultado);
    }, [filtroUsuario, filtroDataInicio, filtroDataFim, dados.logs]);

    if (loading) return <div style={adminStyles.loading}>Carregando relatórios...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>📊 Relatórios de Uso</h1>
            </header>

            {/* CARDS DE RESUMO */}
            <div style={adminStyles.cotaGrid}>
                <div style={{ ...adminStyles.cotaCard, ...styles.cardBlue }}>
                    <h1 style={styles.cardValue}>
                        <span style={styles.cardLabel}>Total de Cálculos</span><br/>
                        {totalCalculosFiltrados}
                    </h1>
                    {temFiltroAtivo && <small style={styles.filteredBadge}> (filtrado)</small>}
                </div>
                <div style={{ ...adminStyles.cotaCard, ...styles.cardGreen }}>
                    <h1 style={styles.cardValue}>
                        <span style={styles.cardLabel}>Pessoas Impactadas</span><br/>
                        {totalPessoasFiltradas}
                    </h1>
                    {temFiltroAtivo && <small style={styles.filteredBadge}> (filtrado)</small>}
                </div>
            </div>

            <section style={styles.filterSection}>
                <div style={styles.filterGroup}>
                    <label>De:</label>
                    <input 
                        type="date" 
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <label>Até:</label>
                    <input 
                        type="date" 
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <button 
                    onClick={() => { setFiltroUsuario(''); setFiltroDataInicio(''); setFiltroDataFim(''); }}
                    style={styles.btnClear}
                >
                    Limpar
                </button>
            </section>

            <section style={styles.contentWrapper}>
                <h3 style={styles.cardTitle}>Resultados ({logsFiltrados.length})</h3>
                <table style={adminStyles.table}>
                    <thead style={adminStyles.thead}>
                        <tr style={adminStyles.tr}>
                            <th>Data/Hora</th>
                            <th>Usuário</th>
                            <th>Pessoas</th>
                            <th>Itens</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={adminStyles.tbody}>
                        {logsFiltrados.map(log => (
                            <tr key={log._id} style={adminStyles.tr}>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Data:</span>
                                    {new Date(log.dataConsulta).toLocaleString('pt-BR')}
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Usuário:</span>
                                    {log.usuarioId?.nome || 'Anônimo'}
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Pessoas:</span>
                                    🧔{`${log.participantes.homens} | 👩${log.participantes.mulheres} | 👶${log.participantes.criancas} | 🍺${log.participantes.adultosQueBebem}`}
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Itens:</span>
                                    {log.itensSelecionados.length}
                                </td>
                                <td style={adminStyles.td}>
                                    <span style={adminStyles.mobileLabel}>Duração:</span>
                                    {log.horasDuracao}h
                                </td>
                                <td style={adminStyles.tdAcoes}>
                                    <button 
                                        onClick={() => setLogSelecionado(log)}
                                        style={styles.btnView}
                                    >
                                        👁️ Ver Lista
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* MODAL DE DETALHES */}
            {logSelecionado && (
                <div style={styles.modalOverlay} onClick={() => setLogSelecionado(null)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Lista Gerada - {logSelecionado.usuarioId?.nome || 'Anônimo'}</h3>
                        </div>
                        <div style={styles.modalBody}>
                            <p style={styles.modalDate}><strong>Data:</strong> {new Date(logSelecionado.dataConsulta).toLocaleString('pt-BR')}</p>
                            <hr style={styles.divider} />
                            {logSelecionado.resultadoFinal.map((item, idx) => {
                                const isObs = item.subtipo === 'observacao';
                                return (
                                    <div key={idx} style={styles.itemRow}>
                                        <span style={isObs ? styles.textObs : styles.textMain}>
                                            {item.nome}
                                        </span>
                                        <strong style={isObs ? styles.textObs : styles.textQty}>
                                            {item.quantidade}
                                        </strong>
                                    </div>
                                );
                            })}
                        </div>
                    <button  onClick={() => setLogSelecionado(null)} style={styles.btnCloseGray}>FECHAR</button>
                    </div>
                </div>
            )}
        </div>
    );
}