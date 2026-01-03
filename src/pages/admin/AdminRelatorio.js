import React, { useEffect, useState } from 'react';
import { commonStyles as styles, adminStyles } from '../../components/Styles';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminRelatorio() {
    const [dados, setDados] = useState({ logs: [], estatisticas: {} });
    const [loading, setLoading] = useState(true);
    const [logSelecionado, setLogSelecionado] = useState(null);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [logsFiltrados, setLogsFiltrados] = useState([]);
    const temFiltroAtivo = filtroUsuario !== '' || filtroDataInicio !== '' || filtroDataFim !== '';
    const listaUsuariosUnicos = [...new Set(dados.logs.map(log => log.usuarioId?.nome || 'Anônimo'))].sort();

    const totalCalculosFiltrados = logsFiltrados.length;

    const totalPessoasFiltradas = logsFiltrados.reduce((acc, log) => {
        // Soma todos os participantes de cada log filtrado
        const somaLog = (log.participantes.homens || 0) + 
                    (log.participantes.mulheres || 0) + 
                    (log.participantes.criancas || 0);
        return acc + somaLog;
    }, 0);

    useEffect(() => {
        fetch(`${API_URL}/admin/relatorio`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setDados(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let resultado = dados.logs;

        // Filtro por Nome de Usuário
        if (filtroUsuario) {
            resultado = resultado.filter(log => 
                (log.usuarioId?.nome || 'Anônimo').toLowerCase().includes(filtroUsuario.toLowerCase())
            );
        }

        // Filtro por Período
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
                <div style={{ ...adminStyles.cotaCard, background: '#e1f5fe', borderColor: '#b3e5fc' }}>
                    <h1 style={{margin: '0px'}}>
                        <span style={{fontSize: '12px'}}>Total de Cálculos</span><br/>
                        {/* Antes: dados?.estatisticas.totalCalculos */}
                        {totalCalculosFiltrados}
                    </h1>
                    {temFiltroAtivo && <small style={{fontSize: '10px', color: '#0288d1'}}> (filtrado)</small>}
                </div>
                <div style={{ ...adminStyles.cotaCard, background: '#e8f5e9', borderColor: '#c8e6c9' }}>
                    <h1 style={{margin: '0px'}}>
                        <span style={{fontSize: '12px'}}>Pessoas Impactadas</span><br/>
                        {/* Antes: dados?.estatisticas.totalPessoasAtendidas[0]?.total */}
                        {totalPessoasFiltradas}
                    </h1>
                    {temFiltroAtivo && <small style={{fontSize: '10px', color: '#0288d1'}}> (filtrado)</small>}
                </div>
            </div>

            <section style={localStyles.filterSection}>
                <div style={localStyles.filterGroup}>
                    <label>Buscar Usuário:</label>
                    <input 
                        type="text" 
                        list="usuarios-list" // Conecta com o id do datalist abaixo
                        placeholder="Digite ou selecione..." 
                        value={filtroUsuario}
                        onChange={(e) => setFiltroUsuario(e.target.value)}
                        style={localStyles.input}
                    />
                    <datalist id="usuarios-list">
                        {listaUsuariosUnicos.map((nome, index) => (
                            <option key={index} value={nome} />
                        ))}
                    </datalist>
                </div>
                <div style={localStyles.filterGroup}>
                    <label>De:</label>
                    <input 
                        type="date" 
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                        style={localStyles.input}
                    />
                </div>
                <div style={localStyles.filterGroup}>
                    <label>Até:</label>
                    <input 
                        type="date" 
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                        style={localStyles.input}
                    />
                </div>
                <button 
                    onClick={() => { setFiltroUsuario(''); setFiltroDataInicio(''); setFiltroDataFim(''); }}
                    style={localStyles.btnClear}
                >
                    Limpar
                </button>
            </section>

            {/* LISTA DE LOGS (USA logsFiltrados AGORA) */}
            <section style={styles.contentWrapper}>
                <h3 style={styles.cardTitle}>Resultados ({logsFiltrados.length})</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={adminStyles.table}>
                        <thead>
                            <tr style={adminStyles.thr}>
                                <th>Data/Hora</th>
                                <th>Usuário</th>
                                <th>Pessoas</th>
                                <th>Itens Selecionados</th>
                                <th>Duração</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsFiltrados.map(log => (
                                <tr key={log._id} style={adminStyles.tr}>
                                    <td>{new Date(log.dataConsulta).toLocaleString('pt-BR')}</td>
                                    <td>{log.usuarioId?.nome || 'Anônimo'}</td>
                                    <td>
                                        🧔{`${log.participantes.homens} | 👩${log.participantes.mulheres} | 👶${log.participantes.criancas} | 🍺${log.participantes.adultosQueBebem}`}
                                    </td>
                                    <td>{log.itensSelecionados.length}</td>
                                    <td>{log.horasDuracao}h</td>
                                    <td>
                                        <button 
                                            onClick={() => setLogSelecionado(log)}
                                            style={localStyles.btnView}
                                        >
                                            👁️ Ver Lista
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* MODAL DE DETALHES */}
            {logSelecionado && (
                <div style={localStyles.modalOverlay}>
                    <div style={localStyles.modalContent}>
                        <div style={localStyles.modalHeader}>
                            <h3>Lista Gerada - {logSelecionado.usuarioId?.nome || 'Anônimo'}</h3>
                            <button onClick={() => setLogSelecionado(null)} style={localStyles.btnClose}>&times;</button>
                        </div>
                        <div style={localStyles.modalBody}>
                            <p><strong>Data:</strong> {new Date(logSelecionado.dataConsulta).toLocaleString('pt-BR')}</p>
                            <hr />
                            {logSelecionado.resultadoFinal.map((item, idx) => (
                                <div key={idx} style={localStyles.itemRow}>
                                    <span style={{ color: item.subtipo === 'observacao' ? '#888' : '#333' }}>
                                        {item.nome}
                                    </span>
                                    <strong style={{ color: item.subtipo === 'observacao' ? '#888' : '#e53935' }}>
                                        {item.quantidade}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const localStyles = {
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 3000
    },
    modalContent: {
        background: 'white',
        width: '90%',
        maxWidth: '450px',
        borderRadius: '8px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    modalHeader: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8f8f8'
    },
    modalBody: {
        padding: '15px',
        overflowY: 'auto'
    },
    btnClose: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#999'
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #f9f9f9',
        fontSize: '14px'
    },
    filterSection: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #eee',
        alignItems: 'flex-end'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    btnClear: {
        padding: '8px 15px',
        background: '#666',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    btnView: {
        padding: '5px 10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
};