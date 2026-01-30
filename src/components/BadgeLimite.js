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
    const limiteAtingido = resta <= 1;

    return (
        <div className={`
            w-full py-2 px-4 text-center text-xs font-bold transition-all duration-300 shadow-xl
            ${limiteAtingido 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-amber-400 text-amber-950 dark:bg-amber-500 dark:text-black'
            }
        `}>
            <div className="flex items-center justify-center gap-2">
                {limiteAtingido ? (
                    <>
                        <span className="text-sm">🔥</span>
                        <span>Limite atingido! Faça login para liberar acesso ilimitado.</span>
                    </>
                ) : (
                    <>
                        <span className="text-sm">🎁</span>
                        <span>Você tem mais {resta - 1} consultas de {limite} gratuitas hoje. Aproveite!</span>
                    </>
                )}
            </div>
        </div>
    );
}