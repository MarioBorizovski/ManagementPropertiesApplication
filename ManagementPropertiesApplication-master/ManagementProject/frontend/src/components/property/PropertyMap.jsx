import { MapPin } from 'lucide-react'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api'
import { useState, useEffect } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const PropertyMap = ({ property }) => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })
    const [mapCoords, setMapCoords] = useState(null)

    useEffect(() => {
        if (!property || !isLoaded || !window.google) return
        const geocoder = new window.google.maps.Geocoder()
        const address = `${property.address}, ${property.city}, ${property.country}`
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const loc = results[0].geometry.location
                setMapCoords({ lat: loc.lat(), lng: loc.lng() })
            }
        })
    }, [property, isLoaded])

    return (
        <div className="relative w-full h-[450px]">
            <div className="absolute top-6 left-6 z-10 p-4 bg-white/95 backdrop-blur rounded-2xl border border-border-warm shadow-xl max-w-[260px] pointer-events-none">
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <MapPin size={14} />
                    </div>
                    <span className="text-[11px] font-black text-title uppercase tracking-[0.1em]">Property Location</span>
                </div>
                <p className="text-[13px] font-bold text-muted leading-relaxed">
                    {property.address}, {property.city}, {property.country}
                </p>
            </div>

            <div className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                {!isLoaded ? (
                    <div className="h-full flex items-center justify-center bg-brand-50/20 text-muted/50 text-xs font-black uppercase tracking-widest">
                        Initializing Map...
                    </div>
                ) : !mapCoords ? (
                    <div className="h-full flex items-center justify-center bg-brand-50/20 text-muted/50 text-xs font-black uppercase tracking-widest">
                        Coordinates Not Found
                    </div>
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCoords}
                        zoom={15}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            zoomControl: true,
                            styles: [
                                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                                { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
                            ]
                        }}
                    >
                        <MarkerF position={mapCoords} />
                    </GoogleMap>
                )}
            </div>
        </div>
    )
}
