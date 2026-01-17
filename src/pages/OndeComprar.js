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

export default function OndeComprar({ conteudo, styles }) {
    const [locais, setLocais] = useState([]);
    const [centro, setCentro] = useState({ lat: -23.5876, lng: -46.7403 });
    const [selecionado, setSelecionado] = useState(null);

    // --- INTEGRAÇÃO DINÂMICA ---
    // Pegamos os botões configurados no Admin
    const botoesConfig = conteudo?.ondeComprar?.botoes || [];
    
    // Filtro inicial: pega o termo do primeiro botão ativo ou um fallback
    const botaoInicial = botoesConfig.find(b => b.ativo);
    const [filtroAtivo, setFiltroAtivo] = useState(botaoInicial?.termo || "");

    const icons = {
        usuario: "https://bandalarga.com.br/img/churrasco/usuario.png"
    };

    // Função de busca principal
    const realizarBusca = useCallback(async (mapInstance, posicao, termo) => {
        if (!mapInstance || !window.google || !termo) return;

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
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>{conteudo?.nomeApp ? `Onde Comprar - ${conteudo.nomeApp}` : "Onde Comprar"}</h1>
                    <p style={styles.subtitle}>Encontre produtos para o seu churrasco</p>
                </header>
                    <MapaConteudo 
                        centro={centro} 
                        setCentro={setCentro}
                        locais={locais}
                        realizarBusca={realizarBusca}
                        botoesConfig={botoesConfig} // Passando os botões do banco
                        filtroAtivo={filtroAtivo}
                        setFiltroAtivo={setFiltroAtivo}
                        selecionado={selecionado}
                        setSelecionado={setSelecionado}
                        icons={icons}
                        primaryColor={conteudo?.primary}
                    />
            </div>
        </APIProvider>
    );
}

function MapaConteudo({ centro, setCentro, locais, realizarBusca, botoesConfig, filtroAtivo, setFiltroAtivo, selecionado, setSelecionado, icons, primaryColor }) {
    const map = useMap();
    const jaBuscouRef = useRef(false);
    const [buscando, setBuscando] = useState(false);

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
        if (map && !jaBuscouRef.current && filtroAtivo) {
            realizarBusca(map, centro, filtroAtivo);
            jaBuscouRef.current = true;
        }
    }, [map, centro, filtroAtivo, realizarBusca]);

    const alterarFiltro = (novoTermo) => {
        if (buscando || !map) return;
        setBuscando(true);
        setFiltroAtivo(novoTermo);
        
        const centroAtual = map.getCenter().toJSON();
        realizarBusca(map, centroAtual, novoTermo).finally(() => {
            setTimeout(() => setBuscando(false), 1500);
        });
    };

    // Pega o ícone/imagem configurado para o botão selecionado
    const getIconeAtual = () => {
        const botao = botoesConfig.find(b => b.termo === filtroAtivo);
        if (botao?.pinUrl) return `${process.env.REACT_APP_API_URL}${botao.pinUrl}`;
        return null; // Fallback para emoji no render se for null
    };

    return (
        <>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* RENDERIZAÇÃO DINÂMICA DOS BOTÕES DO BANCO */}
                {botoesConfig.filter(b => b.ativo).map((botao) => (
                    <button 
                        key={botao.id}
                        onClick={() => alterarFiltro(botao.termo)} 
                        style={{ 
                            ...btnStyle, 
                            backgroundColor: filtroAtivo === botao.termo ? botao.cor : '#555' 
                        }}
                    >
                        {botao.pinUrl ? (
                            <img src={`${process.env.REACT_APP_API_URL}${botao.pinUrl}`} alt="" style={btnImgStyle} />
                        ) : (
                            <span style={{marginRight: '5px'}}>{botao.icone}</span>
                        )}
                        {botao.label}
                    </button>
                ))}
                
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
            >
                <AdvancedMarker position={centro}>
                    <img 
                        src={icons.usuario} 
                        width={45} 
                        height={45} 
                        alt="Você" 
                        style={{
                            transform: 'translate(calc(-50% + 20px), calc(-50% + 50px))', 
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))',
                            pointerEvents: 'none' 
                        }}
                    />
                </AdvancedMarker>

                {locais.map(local => (
                    <AdvancedMarker 
                        key={local.place_id} 
                        position={local.location} 
                        onClick={() => setSelecionado(local)}
                    >
                        {getIconeAtual() ? (
                            <img 
                                src={getIconeAtual()} 
                                width={40} height={40} alt="Local" 
                                style={{ position: 'absolute', left: '-20px', top: '-40px' }} 
                            />
                        ) : (
                            <div style={{fontSize: '30px', position: 'absolute', left: '-15px', top: '-35px'}}>📍</div>
                        )}
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
                                style={{...linkStyle, backgroundColor: primaryColor || '#e67e22'}}
                            >
                                🚗 Como Chegar
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </Map>
            
            <div style={avisoStyle}>
                <span>⚠️</span>
                <span>Ao mover o mapa, clique novamente no botão para recarregar mais locais disponíveis.</span>
            </div>
        </>
    );
}

// --- ESTILOS ---
const btnStyle = { padding: '10px 15px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' };
const btnImgStyle = { width: '18px', height: '18px', marginRight: '5px', objectFit: 'contain' };
const linkStyle = { display: 'block', textAlign: 'center', color: '#fff', padding: '8px', borderRadius: '5px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' };
const avisoStyle = { width: '100%', backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #ffeeba', marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };