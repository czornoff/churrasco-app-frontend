import React, { useEffect, useRef, useState } from 'react';

const MapaChurrasco = () => {
const mapRef = useRef(null);
const [map, setMap] = useState(null);

useEffect(() => {
    // 1. Pega a localização do usuário
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        };

        // 2. Inicializa o mapa
        const googleMap = new window.google.maps.Map(mapRef.current, {
        center: userPos,
        zoom: 14,
        styles: [ /* Você pode adicionar estilos escuros aqui para combinar com seu site */ ]
        });

        setMap(googleMap);

        // 3. Busca locais próximos (Açougues e Lojas)
        const service = new window.google.maps.places.PlacesService(googleMap);
        const request = {
        location: userPos,
        radius: '5000', // 5km de raio
        query: 'açougue premium artigos churrasco'
        };

        service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
            new window.google.maps.Marker({
                position: place.geometry.location,
                map: googleMap,
                title: place.name,
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' // Ícone customizado
            });
            });
        }
        });
    });
    }
}, []);

return (
    <div style={{ padding: '20px' }}>
    <h2>Onde comprar os suprimentos:</h2>
    <div ref={mapRef} style={{ width: '100%', height: '450px', borderRadius: '15px' }} />
    </div>
);
};

export default MapaChurrasco;