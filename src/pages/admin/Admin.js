import React from 'react';
import { Link } from 'react-router-dom';

export default function Admin({styles, adminStyles}) {
    return (
        <div style={styles.container}>
            <header style={adminStyles.headerRow}>
                <h1 style={styles.title}>📱 Painel Administrativo</h1>
            </header>

            <div style={styles.contentWrapper}>
                <h3 style={styles.cardTitle}>Bem-vindo ao Gerenciamento</h3>
                <div style={styles.cardText}>
                    <p>Selecione uma das opções abaixo para gerenciar os dados da sua aplicação.</p>
                </div>

                <div style={adminStyles.shortcutsGrid}>
                    <Link to="/admin/conteudo" style={adminStyles.shortcutCard}>
                        <span style={adminStyles.icon}>📝</span>
                        <div style={adminStyles.shortcutInfo}>
                            <strong style={adminStyles.shortcutTitle}>Conteúdo</strong>
                            <p style={adminStyles.shortcutDesc}>Textos, Dicas e Receitas</p>
                        </div>
                    </Link>

                    <Link to="/admin/item" style={adminStyles.shortcutCard}>
                        <span style={adminStyles.icon}>⚙️</span>
                        <div style={adminStyles.shortcutInfo}>
                            <strong style={adminStyles.shortcutTitle}>Item</strong>
                            <p style={adminStyles.shortcutDesc}>Suas configurações e items</p>
                        </div>
                    </Link>

                    <Link to="/admin/ips" style={adminStyles.shortcutCard}>
                        <span style={adminStyles.icon}>💻</span>
                        <div style={adminStyles.shortcutInfo}>
                            <strong style={adminStyles.shortcutTitle}>Bloqueio IPS</strong>
                            <p style={adminStyles.shortcutDesc}>Liberação de Acesso</p>
                        </div>
                    </Link>

                    <Link to="/admin/usuarios" style={adminStyles.shortcutCard}>
                        <span style={adminStyles.icon}>👥</span>
                        <div style={adminStyles.shortcutInfo}>
                            <strong style={adminStyles.shortcutTitle}>Usuários</strong>
                            <p style={adminStyles.shortcutDesc}>Permissões e Acessos</p>
                        </div>
                    </Link>

                    {/* Exemplo de card de métrica futura */}
                    <Link to="/admin/relatorio" style={adminStyles.shortcutCard}>
                        <span style={adminStyles.icon}>📊</span>
                        <div style={adminStyles.shortcutInfo}>
                            <strong style={adminStyles.shortcutTitle}>Relatórios</strong>
                            <p style={adminStyles.shortcutDesc}>Estatísticas de uso</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}