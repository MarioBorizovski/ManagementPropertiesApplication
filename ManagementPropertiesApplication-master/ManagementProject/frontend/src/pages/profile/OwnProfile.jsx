import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, propertyAPI } from '../../api/services'
import { Layout } from '../../components/ProtectedRoute'
import { User, Mail, Phone, Shield, Building2, Edit3, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { InfoRow } from '../../components/profile/InfoRow'
import { PropertyMiniCard } from '../../components/profile/PropertyMiniCard'
import { Badge } from '../../components/ui/Badge'

export function OwnProfile({ authUser }) {
    const navigate = useNavigate()
    const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', phone: '' })
    const [loading, setLoading]   = useState(true)
    const [saving, setSaving]     = useState(false)
    const [editing, setEditing]   = useState(false)
    const [myProperties, setMyProperties] = useState([])
    const [freshUser, setFreshUser]       = useState(null)

    useEffect(() => {
        userAPI.getCurrentUser()
            .then(({ data }) => {
                setFreshUser(data)
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || ''
                })
            })
            .catch(console.error)
            .finally(() => setLoading(false))

        if (authUser?.role === 'ROLE_AGENT' || authUser?.role === 'ROLE_ADMIN') {
            propertyAPI.getMyListings()
                .then(({ data }) => setMyProperties(data.content || []))
                .catch(console.error)
        }
    }, [authUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await userAPI.updateMe(form)
            toast.success('Profile updated!')
            setEditing(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar: Profile Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-surface rounded-[2.5rem] p-8 border border-border-warm shadow-xl text-center relative overflow-hidden group transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#f0dcd0]/50 to-brand-100 dark:from-brand-900/40 dark:to-transparent" />
                            
                            <div className="relative mt-4">
                                <div className="w-24 h-24 rounded-3xl bg-brand mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl border-4 border-surface transform transition-transform group-hover:scale-105 duration-700">
                                    {authUser?.fullName?.charAt(0) || '?'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-green-500 border-4 border-surface shadow-md" title="Online" />
                            </div>

                            <div className="mt-8">
                                <h1 className="text-2xl font-black text-title tracking-tight mb-1">{freshUser?.firstName} {freshUser?.lastName}</h1>
                                <p className="text-sm text-muted font-bold tracking-tight mb-6">{form.email}</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Badge status={freshUser?.role || authUser?.role} />
                                    {freshUser?.verified && <Badge status="verified" />}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border-warm flex justify-center gap-6">
                                <div>
                                    <p className="text-2xl font-black text-title leading-none mb-1">{myProperties.length}</p>
                                    <p className="text-[10px] uppercase font-black text-muted tracking-widest">Listings</p>
                                </div>
                            </div>

                            <button onClick={() => setEditing(!editing)}
                                    className={`w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-3xl text-xs uppercase tracking-widest font-black transition-all duration-500 border ${
                                        editing 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' 
                                            : 'bg-brand text-white border-transparent hover:bg-brand-700 shadow-xl shadow-brand/20'}`}>
                                {editing ? <X size={16} /> : <Edit3 size={16} />}
                                {editing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Details & Tabs */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Information Section */}
                        <div className="bg-surface rounded-[2.5rem] p-8 border border-border-warm shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black text-title flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand shadow-sm shadow-brand/40" />
                                    Personal Details
                                </h2>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-brand-50/50 dark:bg-brand-900/10 animate-pulse rounded-2xl" />)}
                                </div>
                            ) : editing ? (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-1">First Name</label>
                                            <input className="input !rounded-2xl !bg-brand-50/30 dark:!bg-brand-900/10 !border-border-warm focus:!bg-white" 
                                                   value={form.firstName}
                                                   onChange={e => setForm({ ...form, firstName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-1">Last Name</label>
                                            <input className="input !rounded-2xl !bg-brand-50/30 dark:!bg-brand-900/10 !border-border-warm focus:!bg-white" 
                                                   value={form.lastName}
                                                   onChange={e => setForm({ ...form, lastName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-1">Email Address</label>
                                            <input type="email" 
                                                   className="input !rounded-2xl !bg-brand-50/30 dark:!bg-brand-900/10 !border-border-warm focus:!bg-white" 
                                                   value={form.email}
                                                   onChange={e => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-1">Phone Number</label>
                                            <input className="input !rounded-2xl !bg-brand-50/30 dark:!bg-brand-900/10 !border-border-warm focus:!bg-white" 
                                                   placeholder="+1 234 567 8900" 
                                                   value={form.phone}
                                                   onChange={e => setForm({ ...form, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" className="bg-brand hover:bg-brand-700 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-brand/30 transition-all active:scale-95" disabled={saving}>
                                            <Check size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoRow icon={<User size={18} />}     label="Full Name"  value={`${form.firstName} ${form.lastName}`} />
                                    <InfoRow icon={<Mail size={18} />}     label="Email"      value={form.email} />
                                    <InfoRow icon={<Phone size={18} />}    label="Phone"      value={form.phone || 'Not provided'} empty={!form.phone} />
                                    <InfoRow icon={<Shield size={18} />}   label="Account Type" value={authUser?.role?.replace('ROLE_', '')} />
                                </div>
                            )}
                        </div>

                        {/* Property Section */}
                        {(authUser?.role === 'ROLE_AGENT' || authUser?.role === 'ROLE_ADMIN') && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-lg font-bold text-title">Your Listings</h2>
                                    <button onClick={() => navigate('/agent/dashboard')}
                                            className="text-xs font-bold text-brand hover:bg-background px-4 py-2 rounded-xl transition-colors">
                                        Open Dashboard →
                                    </button>
                                </div>
                                
                                {myProperties.length === 0 ? (
                                    <div className="bg-background rounded-[2rem] p-12 text-center border-2 border-dashed border-border">
                                        <Building2 size={48} className="mx-auto mb-4 text-brand-300" />
                                        <p className="text-muted font-medium">You haven't listed any properties yet.</p>
                                        <button onClick={() => navigate('/agent/dashboard')} className="text-brand font-bold text-sm mt-2 hover:underline">Get started today</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myProperties.slice(0, 6).map(p => (
                                            <PropertyMiniCard key={p.id} property={p} onClick={() => navigate(`/properties/${p.id}`)} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
