import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { Search, MapPin, BedDouble, Users, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Properties() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [loading, setLoading]       = useState(true)
    const [filters, setFilters]       = useState({ city: '', type: '', minPrice: '', maxPrice: '' })
    const [page, setPage]             = useState(0)
    const [totalPages, setTotalPages] = useState(0)


    const fetchProperties = async () => {
        setLoading(true)
        try {
            const params = { page, size: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) }
            const { data } = await propertyAPI.getAll(params)
            setProperties(data.content)
            setTotalPages(data.totalPages)
        } catch {
            toast.error('Failed to load properties')
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => { fetchProperties() }, [page])

    const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchProperties() }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Property</h1>
                <p className="text-gray-500">Browse available properties</p>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="card mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input className="input pl-9" placeholder="City" value={filters.city}
                               onChange={e => setFilters({ ...filters, city: e.target.value })} />
                    </div>
                    <select className="input" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                        <option value="">All Types</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="HOUSE">House</option>
                        <option value="VILLA">Villa</option>
                        <option value="OFFICE">Office</option>
                    </select>
                    <input className="input" type="number" placeholder="Min Price/night" value={filters.minPrice}
                           onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                    <input className="input" type="number" placeholder="Max Price/night" value={filters.maxPrice}
                           onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary mt-4 flex items-center gap-2">
                    <Search size={16} /> Search
                </button>
            </form>

            {/* Results */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card animate-pulse h-64 bg-gray-100" />
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No properties found.</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {properties.map(p => {
                            const imageUrl = p.mainImageUrl
                                ? p.mainImageUrl.startsWith('http')
                                    ? p.mainImageUrl
                                    : `http://localhost:8080${p.mainImageUrl}`
                                : 'https://via.placeholder.com/400x250?text=No+Image'

                            return (
                            <div
                            key={p.id}
                        className="card hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/properties/${p.id}`)}
                    >
                        <div className="mb-3">
                            <img
                                src={imageUrl}
                                alt={p.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>

                        <div className="flex items-start justify-between mb-3">
                            <div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {p.type}
                    </span>
                                <h3 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                                    {p.title}
                                </h3>
                            </div>
                            <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                ${p.pricePerNight}
                                <span className="text-xs font-normal text-gray-400">/night</span>
                            </p>
                        </div>

                        <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                            <MapPin size={14} /> {p.city}, {p.country}
                        </p>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {p.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                    <BedDouble size={14} /> {p.bedrooms} beds
                </span>
                            <span className="flex items-center gap-1">
                    <Users size={14} /> {p.maxGuests} guests
                </span>
                            <span
                                className={`ml-auto text-xs font-medium ${
                                    p.available ? 'text-green-600' : 'text-red-500'
                                }`}
                            >
                    {p.available ? '● Available' : '● Unavailable'}
                </span>
                        </div>
                    </div>
                    )
                    })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button className="btn-secondary" onClick={() => setPage(p => p - 1)} disabled={page === 0}>Previous</button>
                            <span className="flex items-center px-4 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                            <button className="btn-secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
                        </div>
                    )}
                </>
            )}
        </Layout>
    )
}