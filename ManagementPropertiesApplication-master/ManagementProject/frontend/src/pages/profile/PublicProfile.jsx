import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, propertyAPI } from '../../api/services'
import { Layout } from '../../components/ProtectedRoute'
import { User, Mail, Phone, Shield, ArrowLeft, Star, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { InfoRow } from '../../components/profile/InfoRow'
import { PropertyMiniCard } from '../../components/profile/PropertyMiniCard'
import { Badge } from '../../components/ui/Badge'

export function PublicProfile({ agentId }) {
    const navigate = useNavigate()
    const [agent, setAgent]           = useState(null)
    const [properties, setProperties] = useState([])
    const [loading, setLoading]       = useState(true)

    useEffect(() => {
        Promise.all([
            userAPI.getPublicProfile(agentId),
            propertyAPI.getAll({ agentId, size: 20 })
        ])
            .then(([userRes, propRes]) => {
                setAgent(userRes.data)
                setProperties(propRes.data.content || [])
            })
            .catch(() => toast.error('Failed to load profile'))
            .finally(() => setLoading(false))
    }, [agentId])

    if (loading) return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
                <div className="h-64 bg-background rounded-[2rem]" />
                <div className="h-96 bg-background rounded-[2rem]" />
            </div>
        </Layout>
    )

    if (!agent) return (
        <Layout>
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-4 text-brand-300">
                    <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-title">User not found</h2>
                <button onClick={() => navigate(-1)} className="text-brand font-bold text-sm mt-4">Go Back</button>
            </div>
        </Layout>
    )

    const approvedProperties = properties.filter(p => !p.status || p.status === 'APPROVED');
    const ratedProperties = approvedProperties.filter(p => p.reviewCount > 0);
    
    // Stats calculation
    const avgRating = ratedProperties.length > 0
        ? (ratedProperties.reduce((sum, p) => sum + (p.averageRating || 0), 0) / ratedProperties.length).toFixed(1)
        : null
    const totalReviews = approvedProperties.reduce((sum, p) => sum + (p.reviewCount || 0), 0)

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-brand transition-colors">
                    <ArrowLeft size={14} /> Back to Search
                </button>

                {/* Profile Header Card */}
                <div className="bg-surface rounded-[2.5rem] p-8 border border-border-warm shadow-xl relative overflow-hidden group transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#f0dcd0]/50 to-brand-100 dark:from-brand-900/40 dark:to-transparent" />
                    
                    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:px-4">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-brand flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-surface transform transition-transform group-hover:rotate-3 duration-500">
                            {agent.firstName?.charAt(0) || '?'}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left pb-2">
                            <h1 className="text-3xl font-black text-title tracking-tight">
                                {agent.firstName} {agent.lastName}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <Badge status={agent.role} />
                                {agent.verified && (
                                    <Badge status="verified" />
                                )}
                            </div>
                        </div>

                        {/* Stats Box */}
                        <div className="flex gap-8 bg-brand-50/50 dark:bg-black/20 p-6 rounded-[2rem] border border-border-warm shadow-sm">
                            <div className="text-center">
                                <p className="text-2xl font-black text-title leading-none mb-1">{approvedProperties.length}</p>
                                <p className="text-[10px] uppercase font-black text-muted tracking-widest">Listings</p>
                            </div>
                            <div className="w-px h-10 bg-border-warm" />
                            <div className="text-center">
                                <p className="text-2xl font-black text-title flex items-center gap-1.5 justify-center leading-none mb-1">
                                    {totalReviews > 0 ? (
                                        <>
                                            <Star size={20} className="text-amber-500 fill-amber-500" />
                                            {avgRating}
                                        </>
                                    ) : '-'}
                                </p>
                                <p className="text-[10px] uppercase font-black text-muted tracking-widest">{totalReviews} Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface rounded-[2.5rem] p-8 border border-border-warm shadow-xl">
                            <h2 className="text-[10px] font-black text-muted uppercase tracking-widest mb-8 pb-4 border-b border-border-warm">
                                Contact details
                            </h2>
                            <div className="space-y-4">
                                <InfoRow icon={<Mail size={18} />}  label="Direct Email" value={agent.email} />
                                <InfoRow icon={<Phone size={18} />} label="Phone Line" value={agent.phone || 'Not provided'} empty={!agent.phone} />
                            </div>
                        </div>
                    </div>

                    {/* Properties Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xl font-black text-title tracking-tight">
                                Active Listings
                            </h2>
                            <span className="bg-brand/5 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/10">
                                {approvedProperties.length} Total
                            </span>
                        </div>

                        {approvedProperties.length === 0 ? (
                            <div className="bg-surface rounded-[3rem] p-24 text-center border-2 border-dashed border-border-warm">
                                <Building2 size={56} className="mx-auto mb-6 text-brand/20" />
                                <p className="text-muted font-bold text-lg">No active listings available.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {approvedProperties.map(p => (
                                    <PropertyMiniCard key={p.id} property={p}
                                                      onClick={() => navigate(`/properties/${p.id}`)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
