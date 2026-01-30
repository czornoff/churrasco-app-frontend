import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = "AIzaSyCE1lyCvcJwnAXJ6fEI6dnOxFflQQnG-kY";

// IDs do Cloud Console - Agora vinculados corretamente aos estilos no painel do Google
const MAP_ID_LIGHT = "c40e634b60915d61a1edbffc";
const MAP_ID_DARK = "c40e634b60915d61dd7ebe40";

export default function OndeComprar({ conteudo }) {
    const [locais, setLocais] = useState([]);
    const [centro, setCentro] = useState({ lat: -23.5876, lng: -46.7403 });
    const [selecionado, setSelecionado] = useState(null);

    const botoesConfig = conteudo?.ondeComprar?.botoes || [];
    const botaoInicial = botoesConfig.find(b => b.ativo);
    const [filtroAtivo, setFiltroAtivo] = useState(botaoInicial?.termo || "");

    const icons = {
        usuario: "https://bandalarga.com.br/img/churrasco/usuario.png"
    };

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
            <div className="max-w-8xl mx-auto px-4 py-8 md:py-12 bg-white dark:bg-zinc-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
                    <header className="text-center mb-10">
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-3 tracking-tight uppercase">
                            Onde Comprar
                        </h1>
                        <p className="text-lg md:text-xl text-orange-700 dark:text-orange-400 font-medium">
                            Encontre os melhores suprimentos para o seu churrasco perto de você
                        </p>
                    </header>

                    <MapaConteudo 
                        centro={centro} 
                        setCentro={setCentro}
                        locais={locais}
                        realizarBusca={realizarBusca}
                        botoesConfig={botoesConfig}
                        filtroAtivo={filtroAtivo}
                        setFiltroAtivo={setFiltroAtivo}
                        selecionado={selecionado}
                        setSelecionado={setSelecionado}
                        icons={icons}
                        primaryColor={conteudo?.primary}
                    />
                </div>
            </div>
        </APIProvider>
    );
}

function MapaConteudo({ centro, setCentro, locais, realizarBusca, botoesConfig, filtroAtivo, setFiltroAtivo, selecionado, setSelecionado, icons, primaryColor }) {
    const map = useMap();
    const jaBuscouRef = useRef(false);
    const [buscando, setBuscando] = useState(false);

    // Estado para o tema detectando a classe 'dark' no HTML
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

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

    const getIconeAtual = () => {
        const botao = botoesConfig.find(b => b.termo === filtroAtivo);
        if (botao?.pinUrl) return `${process.env.REACT_APP_API_URL}${botao.pinUrl}`;
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                {botoesConfig.filter(b => b.ativo).map((botao) => (
                    <button 
                        key={botao.id}
                        onClick={() => alterarFiltro(botao.termo)} 
                        style={{ backgroundColor: filtroAtivo === botao.termo ? botao.cor : '#3f3f46' }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-xl active:scale-95 ${buscando ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-150'}`}
                    >
                        {botao.pinUrl ? (
                            <img src={`${process.env.REACT_APP_API_URL}${botao.pinUrl}`} alt="" className="w-5 h-5 object-contain" />
                        ) : (
                            <span className="text-lg">{botao.icone}</span>
                        )}
                        {botao.label}
                    </button>
                ))}
                
                <button 
                    onClick={localizarUsuario} 
                    className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-400 text-white rounded-xl font-bold text-sm shadow-xl border-2 border-white dark:border-zinc-800 transition-all active:scale-95"
                >
                    📍 Onde estou?
                </button>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 h-[500px]">
                <Map
                    key={isDarkMode ? 'map-dark' : 'map-light'}
                    className="w-full h-full"
                    defaultCenter={centro}
                    defaultZoom={14}
                    mapId={isDarkMode ? MAP_ID_DARK : MAP_ID_LIGHT}
                    disableDefaultUI={true}
                >
                    <AdvancedMarker position={centro}>
                        <img 
                            src={icons.usuario} 
                            className="w-11 h-11 -translate-x-1/2 -translate-y-[90%] drop-shadow-xl pointer-events-none"
                            alt="Você" 
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
                                    className="w-10 h-10 absolute -left-5 -top-10" 
                                    alt="Local" 
                                />
                            ) : (
                                <div className="text-3xl absolute -left-4 -top-9">📍</div>
                            )}
                        </AdvancedMarker>
                    ))}

                    {selecionado && (
                        <InfoWindow 
                            position={selecionado.location} 
                            onCloseClick={() => setSelecionado(null)}
                        >
                            <div className="p-1 max-w-[220px] text-zinc-900">
                                <h4 className="font-bold text-sm mb-1">{selecionado.name}</h4>
                                {selecionado.rating && (
                                    <div className="flex items-center gap-1 mb-2 text-amber-500 text-xs">
                                        {"★".repeat(Math.round(selecionado.rating))} 
                                        <span className="text-zinc-500 font-medium">({selecionado.user_ratings_total})</span>
                                    </div>
                                )}
                                <p className="text-[11px] leading-tight text-zinc-600 mb-3">{selecionado.formatted_address}</p>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selecionado.formatted_address)}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    style={{ backgroundColor: primaryColor || '#ea580c' }}
                                    className="block w-full text-center text-white py-2 rounded-xl text-xs font-bold hover:brightness-110 transition-all no-underline"
                                >
                                    🚗 Como Chegar
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
            
            <div className="flex items-center justify-center gap-2 w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-400 p-3 rounded-xl text-xs md:text-sm font-medium">
                <span>⚠️</span>
                <span>Ao mover o mapa, clique nos filtros para buscar novos locais nesta região.</span>
            </div>
        </div>
    );
}