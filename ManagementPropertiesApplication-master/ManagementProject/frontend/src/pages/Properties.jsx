import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { Search, MapPin, Grid, Map as MapIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { PropertySearchMap } from '../components/property/PropertySearchMap'
import { PropertyMiniCard } from '../components/profile/PropertyMiniCard'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

export default function Properties() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [loading, setLoading]       = useState(true)
    const [view, setView]             = useState('grid') // 'grid' or 'map'
    const [filters, setFilters]       = useState({ city: '', type: '', minPrice: '', maxPrice: '' })
    const [page, setPage]             = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    
    // Google Places Autocomplete setup
    const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries })
    const autocompleteRef = useRef(null)
    const [searchedBounds, setSearchedBounds] = useState(null)
    const [dropdownOpen, setDropdownOpen]     = useState(false)

    const fetchProperties = async () => {
        setLoading(true)
        try {
            // When in map view, we fetch more properties to show on map, or just keep current page
            const params = { 
                page: view === 'map' ? 0 : page, 
                size: view === 'map' ? 100 : 12, 
                ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) 
            }
            const { data } = await propertyAPI.getAll(params)
            setProperties(data.content)
            setTotalPages(data.totalPages)
        } catch {
            toast.error('Failed to load properties')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProperties() }, [page, view])

    const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchProperties() }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            if (place && place.address_components) {
                // Find the city (locality) in address components
                const cityComponent = place.address_components.find(c => 
                    c.types.includes('locality') || 
                    c.types.includes('sublocality') ||
                    c.types.includes('postal_town')
                );
                
                const cityName = cityComponent ? cityComponent.long_name : (place.name || '');
                
                setFilters(prev => ({ ...prev, city: cityName }))

                if (place.geometry?.viewport) {
                    setSearchedBounds({
                        north: place.geometry.viewport.getNorthEast().lat(),
                        east: place.geometry.viewport.getNorthEast().lng(),
                        south: place.geometry.viewport.getSouthWest().lat(),
                        west: place.geometry.viewport.getSouthWest().lng(),
                    })
                }
            }
        }
    }

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 section-entry" style={{ animationDelay: '0.1s' }}>
                <div>
                    <h1 className="text-5xl font-black text-title tracking-tight mb-3">Explore Properties</h1>
                    <p className="text-muted text-lg font-medium">Discover your perfect home from our curated collection</p>
                </div>
                
                {/* View Toggle - Warm Brown Refined */}
                <div className="flex bg-surface p-1.5 rounded-2xl border border-brand-100 shadow-sm self-start md:self-auto">
                    <button 
                        onClick={() => setView('grid')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'grid' ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'text-muted hover:bg-brand-50 hover:text-brand-600'}`}
                    >
                        <Grid size={16} /> Grid
                    </button>
                    <button 
                        onClick={() => setView('map')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'text-muted hover:bg-brand-50 hover:text-brand-600'}`}
                    >
                        <MapIcon size={16} /> Map
                    </button>
                </div>
            </div>

            {/* Filters - High-end Integrated Bar with Brown Borders */}
            <form onSubmit={handleSearch} className="bg-surface rounded-[2.5rem] p-4 border border-brand-100 shadow-xl shadow-brand-900/5 mb-12 section-entry" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-600 group-focus-within:scale-110 transition-transform z-10" size={18} />
                        {isLoaded ? (
                            <Autocomplete
                                onLoad={(ref) => autocompleteRef.current = ref}
                                onPlaceChanged={onPlaceChanged}
                                options={{ types: ['(regions)'] }}
                            >
                                <input className="input !pl-14 !pr-6 !py-4 !rounded-[1.5rem] !bg-brand-50/30 !border-brand-100/50 focus:!bg-white focus-brand w-full transition-all font-bold text-title placeholder:text-muted/40" 
                                       placeholder="Search city..." 
                                       value={filters.city}
                                       onChange={e => setFilters({ ...filters, city: e.target.value })} 
                                       onKeyDown={(e) => {
                                           if (e.key === 'Enter') { e.preventDefault(); handleSearch(e); }
                                       }}
                                />
                            </Autocomplete>
                        ) : (
                            <input className="input !pl-14 !pr-6 !py-4 !rounded-[1.5rem] !bg-brand-50/30 !border-brand-100/50 focus:!bg-white focus-brand w-full transition-all font-bold text-title placeholder:text-muted/40" 
                                   placeholder="Search city..." 
                                   value={filters.city}
                                   onChange={e => setFilters({ ...filters, city: e.target.value })} />
                        )}
                    </div>

                    <div className="relative z-20">
                        <button type="button" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full h-full bg-brand-50/30 rounded-[1.5rem] border border-brand-100/50 focus:bg-white focus-brand transition-all flex items-center justify-between px-6 py-4 outline-none">
                            <span className={`text-sm font-bold ${filters.type ? 'text-title' : 'text-muted/60'}`}>
                                {filters.type ? filters.type.charAt(0) + filters.type.slice(1).toLowerCase() : 'All Categories'}
                            </span>
                            <Search size={16} className={`text-brand-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-surface rounded-2xl border border-brand-100 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {['', 'APARTMENT', 'HOUSE', 'VILLA', 'OFFICE'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => { setFilters({ ...filters, type }); setDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-title hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                    >
                                        {type ? (type.charAt(0) + type.slice(1).toLowerCase()) : 'All Categories'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-brand-50/30 rounded-[1.5rem] border border-brand-100/50 focus-within:bg-white focus-brand transition-all flex items-center px-6">
                        <span className="text-brand-800/40 text-[10px] font-black uppercase tracking-widest mr-3">Min</span>
                        <input className="bg-transparent border-none focus:ring-0 w-full py-4 text-sm font-bold text-title placeholder:text-muted/30" 
                               type="number" placeholder="Price" value={filters.minPrice}
                               onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                    </div>

                    <div className="bg-brand-50/30 rounded-[1.5rem] border border-brand-100/50 focus-within:bg-white focus-brand transition-all flex items-center px-6">
                        <span className="text-brand-800/40 text-[10px] font-black uppercase tracking-widest mr-3">Max</span>
                        <input className="bg-transparent border-none focus:ring-0 w-full py-4 text-sm font-bold text-title placeholder:text-muted/30" 
                               type="number" placeholder="Price" value={filters.maxPrice}
                               onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                    </div>

                    <button type="submit" className="bg-brand hover:bg-brand-700 text-white !rounded-[1.5rem] !py-4 flex items-center justify-center gap-3 shadow-xl shadow-brand/30 group transition-all duration-300">
                        <Search size={20} className="group-hover:scale-110 group-hover:-rotate-12 transition-transform" /> 
                        <span className="font-extrabold uppercase tracking-widest text-[13px]">Search Now</span>
                    </button>
                </div>
            </form>

            {/* Main Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-[1.1] bg-surface animate-pulse rounded-[2rem] border border-border-warm" />
                    ))}
                </div>
            ) : view === 'map' ? (
                <PropertySearchMap properties={properties} searchedBounds={searchedBounds} />
            ) : properties.length === 0 ? (
                <div className="text-center py-32 bg-background rounded-[3rem] border-2 border-dashed border-border-warm">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-brand" />
                    </div>
                    <h3 className="text-xl font-bold text-title mb-2">No properties matches</h3>
                    <p className="text-muted font-medium">Try adjusting your filters or search area</p>
                    <button onClick={() => { setFilters({ city: '', type: '', minPrice: '', maxPrice: '' }); setPage(0); }}
                            className="text-brand font-black mt-4 hover:underline uppercase tracking-widest text-xs">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {properties.map(p => (
                            <PropertyMiniCard key={p.id} property={p} onClick={() => navigate(`/properties/${p.id}`)} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-border">
                            <button 
                                className="p-3 rounded-2xl border border-border text-brand hover:bg-brand hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none" 
                                onClick={() => setPage(p => p - 1)} 
                                disabled={page === 0}
                            >
                                <Search size={20} className="rotate-180" />
                            </button>
                            <span className="text-sm font-bold text-title">
                                Page <span className="bg-border px-3 py-1 rounded-lg italic mx-1">{page + 1}</span> of {totalPages}
                            </span>
                            <button 
                                className="p-3 rounded-2xl border border-border text-brand hover:bg-brand hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none" 
                                onClick={() => setPage(p => p + 1)} 
                                disabled={page >= totalPages - 1}
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </Layout>
    )
}