import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, OverlayViewF, InfoWindowF, useLoadScript } from '@react-google-maps/api';
import { MapPin, Navigation, Star, Loader2 } from 'lucide-react';
import { resolveImageUrl, formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
    ]
};

/**
 * Geocodes a single address using the Google Maps Geocoder API.
 * Returns { lat, lng } or null if it fails.
 */
function geocodeAddress(geocoder, address) {
    return new Promise((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const loc = results[0].geometry.location;
                resolve({ lat: loc.lat(), lng: loc.lng() });
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Main map component. Auto-geocodes properties that have no lat/lng
 * using the Google Maps Geocoder JS API on the client side.
 */
export const PropertySearchMap = ({ properties, searchedBounds }) => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries });

    const navigate = useNavigate();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [map, setMap]                           = useState(null);

    // Resolved properties — start with those that already have coords
    const [resolvedProperties, setResolvedProperties] = useState([]);
    const [geocodingProgress, setGeocodingProgress]   = useState(null); // null | { done, total }
    const geocodingRef = useRef(false); // prevent double-run
    const hasFittedBounds = useRef(false); // prevent map from jumping while typing filters

    // When properties or map loads, kick off geocoding for missing coords
    useEffect(() => {
        if (!isLoaded || !window.google || properties.length === 0) return;
        if (geocodingRef.current) return;
        geocodingRef.current = true;

        const withCoords    = properties.filter(p => p.latitude && p.longitude);
        const withoutCoords = properties.filter(p => !p.latitude || !p.longitude);

        // If everything already has coords, just use them
        if (withoutCoords.length === 0) {
            setResolvedProperties(withCoords);
            return;
        }

        // Start with properties that already have coords
        setResolvedProperties(withCoords);
        setGeocodingProgress({ done: 0, total: withoutCoords.length });

        const geocoder = new window.google.maps.Geocoder();

        (async () => {
            let done = 0;
            for (const property of withoutCoords) {
                const address = `${property.address}, ${property.city}, ${property.country}`;
                const coords = await geocodeAddress(geocoder, address);

                if (coords) {
                    const enriched = { ...property, latitude: coords.lat, longitude: coords.lng };
                    setResolvedProperties(prev => [...prev, enriched]);
                }

                done++;
                setGeocodingProgress({ done, total: withoutCoords.length });

                // Small delay to avoid hitting Google's rate limit
                await new Promise(r => setTimeout(r, 150));
            }
            setGeocodingProgress(null); // geocoding done
        })();
    }, [isLoaded, properties]);

    // Fit map bounds to all resolved markers
    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    useEffect(() => {
        if (!map || resolvedProperties.length === 0 || !window.google || hasFittedBounds.current) return;
        // Don't auto-fit to properties if we're fitting to the whole city
        if (searchedBounds) return; 

        const bounds = new window.google.maps.LatLngBounds();
        resolvedProperties.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }));
        map.fitBounds(bounds);
        hasFittedBounds.current = true;
    }, [map, resolvedProperties, searchedBounds]);

    // Fly to explicitly searched bounds from Autocomplete
    useEffect(() => {
        if (map && searchedBounds && window.google) {
            map.fitBounds(searchedBounds);
            hasFittedBounds.current = true; // prevent auto-fit from jumping back to properties
        }
    }, [map, searchedBounds]);

    // ── Loading state ────────────────────────────────────────────────────────
    if (!isLoaded) {
        return (
            <div className="w-full h-[600px] bg-background flex items-center justify-center rounded-3xl border border-border animate-pulse">
                <div className="text-center">
                    <Navigation className="mx-auto mb-2 text-brand-300 animate-bounce" />
                    <p className="text-brand font-bold text-sm">Initializing Map...</p>
                </div>
            </div>
        );
    }

    const defaultCenter = resolvedProperties[0]
        ? { lat: resolvedProperties[0].latitude, lng: resolvedProperties[0].longitude }
        : { lat: 45.4215, lng: -75.6972 }; // Ottawa fallback

    return (
        <div className="w-full h-[600px] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl relative shadow-brand/5">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={12}
                center={defaultCenter}
                onLoad={onMapLoad}
                options={mapOptions}
                onClick={() => setSelectedProperty(null)}
            >
                {resolvedProperties.map((p) => (
                    <OverlayViewF
                        key={`${p.id}-${p.latitude}`}
                        position={{ lat: p.latitude, lng: p.longitude }}
                        mapPaneName="overlayMouseTarget"
                    >
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProperty(p);
                            }}
                            className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group select-none"
                        >
                            {/* Marker Container */}
                            <div className="relative flex flex-col items-center">
                                {/* The circular photo and price bubble */}
                                <div className="bg-surface rounded-full p-0.5 shadow-lg border border-border group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <img
                                            src={resolveImageUrl(p.mainImageUrl)}
                                            className="w-full h-full object-cover"
                                            alt={p.title}
                                            draggable={false}
                                        />
                                    </div>
                                    {/* Price tag attached to the circle */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap z-10 border border-[#784e2a]">
                                        ${p.pricePerNight}
                                    </div>
                                </div>
                                
                                {/* Pointer arrow below the bubble/tag */}
                                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#8c5d36] -mt-[1px] group-hover:-translate-y-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </OverlayViewF>
                ))}

                {selectedProperty && (
                    <InfoWindowF
                        position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
                        onCloseClick={() => setSelectedProperty(null)}
                    >
                        <div
                            onClick={() => navigate(`/properties/${selectedProperty.id}`)}
                            className="bg-surface p-1 rounded-xl w-48 cursor-pointer group"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-2">
                                <img
                                    src={resolveImageUrl(selectedProperty.mainImageUrl)}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    alt={selectedProperty.title}
                                />
                                <div className="absolute top-1 left-1 bg-surface/90 backdrop-blur-sm text-brand text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    {selectedProperty.type}
                                </div>
                            </div>
                            <div className="px-1 pb-1">
                                <h3 className="font-bold text-title text-xs truncate mb-1">{selectedProperty.title}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-brand font-bold text-xs">{formatCurrency(selectedProperty.pricePerNight)}</p>
                                    {selectedProperty.averageRating && (
                                        <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                                            <Star size={10} fill="currentColor" />
                                            <span className="font-bold">{selectedProperty.averageRating}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-[8px] text-gray-400 mt-1">
                                    <MapPin size={8} className="text-brand" />
                                    <span className="truncate">{selectedProperty.city}</span>
                                </div>
                            </div>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>

            {/* Geocoding progress indicator */}
            {geocodingProgress && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-border">
                    <Loader2 size={15} className="text-brand animate-spin flex-shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-0.5">Locating Properties</p>
                        <p className="text-xs font-black text-title">
                            {geocodingProgress.done} / {geocodingProgress.total} geocoded
                        </p>
                    </div>
                    {/* Progress bar */}
                    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand rounded-full transition-all duration-300"
                            style={{ width: `${(geocodingProgress.done / geocodingProgress.total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Floating Stats */}
            <div className="absolute bottom-6 left-6 p-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl pointer-events-none">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Interactive Search</p>
                <p className="text-sm font-black text-title">
                    Showing {resolvedProperties.length} {geocodingProgress ? `/ ${properties.length}` : ''} locations
                </p>
            </div>
        </div>
    );
};
