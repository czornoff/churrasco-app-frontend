import React, { useEffect } from 'react';

const AdBanner = ({ slot }) => {
    useEffect(() => {
        if (window.location.hostname !== "localhost") {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("Erro ao carregar AdSense:", e);
            }
        }
    }, []);

    return (
        <div className="text-center my-3 overflow-hidden max-h-[100px] bg-transparent flex justify-center items-center">
            <ins className="adsbygoogle"
                style={{ display: 'inline-block', width: '100%', height: '90px' }}
                data-ad-client="ca-pub-2950297102005696"
                data-ad-slot={slot}
                data-ad-format="horizontal"
                data-full-width-responsive="false"></ins> 
        </div>
    );
};

export default AdBanner;