import React, { useState, useEffect } from 'react';

export default function BadgeLimite({ usuario, API_URL, limite }) {
    const [consultas, setConsultas] = useState(0);

    // Só buscamos se o usuário não estiver logado
    useEffect(() => {
        if (!usuario) {
            const atualizarBadge = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/verificar-limite-ip`, { credentials: 'include' });
                    const data = await res.json();
                    setConsultas(data.consultas || 0);
                } catch (err) {
                    console.log("Erro ao carregar limite");
                }
            };
            atualizarBadge();
            
            // Ouvir eventos de clique para atualizar o número quando ele navegar
            window.addEventListener('click', atualizarBadge);
            return () => window.removeEventListener('click', atualizarBadge);
        }
    }, [usuario, API_URL]);

    if (usuario || consultas === 0) return null;

    const resta = Math.max(0, limite - consultas);

    return (
        <div style={{
            backgroundColor: resta <= 1 ? '#ff4444' : '#ffc107',
            color: resta <= 1 ? '#fff' : '#000',
            textAlign: 'center',
            padding: '5px',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
            {resta > 1 
                ? `🎁 Você tem mais ${resta-1} consultas de ${limite} gratuitas hoje. Aproveite!` 
                : `🔥 Limite atingido! Faça login para liberar acesso ilimitado.`
            }
        </div>
    );
}