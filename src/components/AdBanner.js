import React, { useEffect } from 'react';

const AdBanner = ({ slot }) => {
    useEffect(() => {
        if (window.location.hostname !== "localhost") {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return (
        <div style={{ 
            textAlign: 'center', 
            margin: '10px 0', // Reduzi a margem
            overflow: 'hidden', 
            maxHeight: '100px', // Limita a altura para não ser um "quadradão"
            background: 'transparent'
        }}>
            <ins className="adsbygoogle"
                style={{ display: 'inline-block', width: '100%', height: '90px' }} // Altura fixa menor
                data-ad-client="ca-pub-2950297102005696"
                data-ad-slot={slot}
                data-ad-format="horizontal" // Força o formato horizontal/fino
                data-full-width-responsive="false"></ins> 
        </div>
    );
};

export default AdBanner;