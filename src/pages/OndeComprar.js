import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';

// --- CONFIGURAÇÕES ESTÁTICAS ---
const GOOGLE_MAPS_API_KEY = "AIzaSyCE1lyCvcJwnAXJ6fEI6dnOxFflQQnG-kY";
const MAP_ID = "c40e634b60915d61a1edbffc";
const containerStyle = { width: '100%', height: '500px', borderRadius: '15px' };

export default function OndeComprar({ styles }) {
    const [locais, setLocais] = useState([]);
    const [centro, setCentro] = useState({ lat: -23.5876, lng: -46.7403 });
    const [selecionado, setSelecionado] = useState(null);

    const filtros = {
        acougue: "açougue OR 'casa de carnes' OR 'boutique de carnes' OR carnes",
        mercado: "supermercado OR mercado OR empório",
        utensilio: "churrasqueira OR 'steak boutique' OR 'artigos para churrasco'",
        parceiro: "Swift"
    };

    const [filtroAtivo, setFiltroAtivo] = useState(filtros.acougue);

    const icons = {
        acougue: "https://bandalarga.com.br/img/churrasco/acougue.png",
        utensilio: "https://bandalarga.com.br/img/churrasco/utensilio.png",
        mercado: "https://bandalarga.com.br/img/churrasco/mercado.png",
        parceiro: "https://bandalarga.com.br/img/churrasco/patrocinio.png",
        usuario: "https://bandalarga.com.br/img/churrasco/usuario.png"
    };

    // Função de busca principal
    const realizarBusca = useCallback(async (mapInstance, posicao, termo) => {
        if (!mapInstance || !window.google) return;

        // Criamos uma chave única baseada na posição (arredondada) e no termo
        const cacheKey = `busca_${termo}_${posicao.lat.toFixed(3)}_${posicao.lng.toFixed(3)}`;
        const cacheSalvo = sessionStorage.getItem(cacheKey);

        if (cacheSalvo) {
            setLocais(JSON.parse(cacheSalvo));
            return;
        }
        
        try {
            const { Place } = await window.google.maps.importLibrary("places");
            
            const request = {
                textQuery: termo,
                fields: ['displayName', 'formattedAddress', 'location', 'rating', 'userRatingCount', 'id'],
                locationBias: { radius: 5000, center: posicao },
                language: 'pt-BR',
            };

            const { places } = await Place.searchByText(request);
        
            if (places && places.length > 0) {
                const formatados = places.map(p => ({
                    place_id: p.id,
                    name: p.displayName,
                    formatted_address: p.formattedAddress,
                    location: { lat: p.location.lat(), lng: p.location.lng() },
                    rating: p.rating,
                    user_ratings_total: p.userRatingCount
                }));

                // Salva no cache antes de atualizar o estado
                sessionStorage.setItem(cacheKey, JSON.stringify(formatados));
                setLocais(formatados);
            } else {
                setLocais([]);
            }
        } catch (error) {
            console.error("Erro na busca Places:", error);
        }
    }, []);

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <div style={{ ...styles.container, padding: '20px' }}>
                <h1 style={styles.titulo}>🔥 Onde Comprar</h1>
                
                <MapaConteudo 
                    centro={centro} 
                    setCentro={setCentro}
                    locais={locais}
                    realizarBusca={realizarBusca}
                    filtros={filtros}
                    filtroAtivo={filtroAtivo}
                    setFiltroAtivo={setFiltroAtivo}
                    selecionado={selecionado}
                    setSelecionado={setSelecionado}
                    icons={icons}
                />
            </div>
        </APIProvider>
    );
}

function MapaConteudo({ centro, setCentro, locais, realizarBusca, filtros, filtroAtivo, setFiltroAtivo, selecionado, setSelecionado, icons }) {
    const map = useMap();
    const jaBuscouRef = useRef(false);
    const [buscando, setBuscando] = useState(false);

    // Ajuste de tamanho do mapa quando carrega
    useEffect(() => {
        if (map) {
            window.google.maps.event.trigger(map, 'resize');
        }
    }, [map]);

    const localizarUsuario = useCallback(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const novaPosicao = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setCentro(novaPosicao);
                if (map) {
                    map.panTo(novaPosicao);
                    map.setZoom(15);
                    realizarBusca(map, novaPosicao, filtroAtivo);
                }
            },
            (err) => console.warn(err),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }, [map, filtroAtivo, realizarBusca, setCentro]);

    useEffect(() => {
        if (map && !jaBuscouRef.current) {
            realizarBusca(map, centro, filtroAtivo);
            jaBuscouRef.current = true;
        }
    }, [map, centro, filtroAtivo, realizarBusca]);

    const alterarFiltro = (novoTermo) => {
        if (buscando || !map) return;
        setBuscando(true);
        setFiltroAtivo(novoTermo);
        
        // Buscamos usando o centro atual do mapa (onde o usuário está olhando agora)
        const centroAtual = map.getCenter().toJSON();
        realizarBusca(map, centroAtual, novoTermo).finally(() => {
            setTimeout(() => setBuscando(false), 1500);
        });
    };

    const getIconePorFiltro = () => {
        if (filtroAtivo === filtros.parceiro) return icons.parceiro;
        if (filtroAtivo === filtros.utensilio) return icons.utensilio;
        if (filtroAtivo === filtros.mercado) return icons.mercado;
        return icons.acougue;
    };

    return (
        <>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => alterarFiltro(filtros.acougue)} style={{ ...btnStyle, backgroundColor: filtroAtivo === filtros.acougue ? '#FB6458' : '#555' }}>
                    <img src={icons.acougue} alt="" style={btnImgStyle} /> Açougues
                </button>
                <button onClick={() => alterarFiltro(filtros.mercado)} style={{ ...btnStyle, backgroundColor: filtroAtivo === filtros.mercado ? '#FC7E84' : '#555' }}>
                    <img src={icons.mercado} alt="" style={btnImgStyle} /> Mercados
                </button>
                <button onClick={() => alterarFiltro(filtros.utensilio)} style={{ ...btnStyle, backgroundColor: filtroAtivo === filtros.utensilio ? '#EDAF23' : '#555' }}>
                    <img src={icons.utensilio} alt="" style={btnImgStyle} /> Utensílios
                </button>
                <button onClick={() => alterarFiltro(filtros.parceiro)} style={{ ...btnStyle, backgroundColor: filtroAtivo === filtros.parceiro ? '#000' : '#555' }}>
                    <img src={icons.parceiro} alt="" style={btnImgStyle} /> Swift
                </button>
                
                <button onClick={localizarUsuario} style={{ ...btnStyle, backgroundColor: '#4285F4', marginLeft: 'auto', border: '2px solid #fff' }}>
                    📍 Onde estou?
                </button>
            </div>

            <Map
                style={containerStyle}
                defaultCenter={centro}
                defaultZoom={14}
                mapId={MAP_ID}
                disableDefaultUI={true}
                // REMOVIDO: onCenterChanged para evitar deslocamento visual
            >
                {/* Marcador do Usuário - Centralizado (ponto no meio) */}
                <AdvancedMarker position={centro}>
                    <img src={icons.usuario} width={45} height={45} alt="Você" 
                        style={{ transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
                </AdvancedMarker>

                {/* Marcadores das Lojas - Ancorados na base (pé do ícone) */}
                {locais.map(local => (
                    <AdvancedMarker 
                        key={local.place_id} 
                        position={local.location} 
                        onClick={() => setSelecionado(local)}
                    >
                        <img 
                            src={getIconePorFiltro()} 
                            width={40} 
                            height={40} 
                            alt="Local" 
                            style={{ 
                                position: 'absolute',
                                left: '-20px', // Metade da largura (40/2)
                                top: '-40px'   // Total da altura para a base tocar o ponto
                            }} 
                        />
                    </AdvancedMarker>
                ))}

                {selecionado && (
                    <InfoWindow 
                        position={selecionado.location} 
                        onCloseClick={() => setSelecionado(null)}
                    >
                        <div style={{ color: '#000', maxWidth: '200px', padding: '5px' }}>
                            <h4 style={{ margin: '0 0 5px', fontSize: '14px' }}>{selecionado.name}</h4>
                            {selecionado.rating && (
                                <div style={{ marginBottom: '5px', color: '#f1c40f', fontSize: '12px' }}>
                                    {"★".repeat(Math.round(selecionado.rating))} <span style={{color: '#666'}}>({selecionado.user_ratings_total})</span>
                                </div>
                            )}
                            <p style={{ fontSize: '11px', margin: '0 0 10px', color: '#333' }}>{selecionado.formatted_address}</p>
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selecionado.formatted_address)}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={linkStyle}
                            >
                                🚗 Como Chegar
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </>
    );
}

// --- ESTILOS COMPLEMENTARES ---
const btnStyle = { 
    padding: '10px 15px', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    display: 'flex', 
    alignItems: 'center',
    transition: 'all 0.2s ease'
};

const btnImgStyle = { width: '15px', height: '15px', marginRight: '5px' };

const linkStyle = { 
    display: 'block', 
    textAlign: 'center', 
    backgroundColor: '#e67e22', 
    color: '#fff', 
    padding: '8px', 
    borderRadius: '5px', 
    textDecoration: 'none', 
    fontSize: '12px', 
    fontWeight: 'bold' 
};