import React, { useEffect } from 'react';

const AdBanner = ({ slot }) => {
    useEffect(() => {
        try {
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("Erro ao carregar bloco de anúncio:", e);
        }
    }, []);

    return (
        <div style={{ 
            textAlign: 'center', 
            margin: '20px auto', 
            overflow: 'hidden', 
            minHeight: '90px',
            width: '100%',
            maxWidth: '1200px' 
        }}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-2950297102005696" 
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdBanner;