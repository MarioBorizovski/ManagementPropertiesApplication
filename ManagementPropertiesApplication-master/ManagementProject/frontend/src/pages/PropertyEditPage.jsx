import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import toast from 'react-hot-toast'
import { PropertyForm } from '../components/agent/PropertyForm'
import { ArrowLeft } from 'lucide-react'

export default function PropertyEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [loading, setLoading] = useState(isEditing)
    const [editingProperty, setEditingProperty] = useState(null)
    const [form, setForm] = useState({ 
        title: '', description: '', address: '', city: '', country: '', 
        type: 'APARTMENT', pricePerNight: '', bedrooms: '', bathrooms: '', 
        maxGuests: '', available: true, latitude: null, longitude: null
    })
    
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false)

    useEffect(() => {
        if (!isEditing) return
        propertyAPI.getById(id)
            .then(({ data }) => {
                setEditingProperty(data)
                setForm({ 
                    title: data.title, description: data.description || '', 
                    address: data.address, city: data.city, country: data.country, 
                    type: data.type, pricePerNight: data.pricePerNight, 
                    bedrooms: data.bedrooms, bathrooms: data.bathrooms, 
                    maxGuests: data.maxGuests, available: data.available,
                    latitude: data.latitude, longitude: data.longitude
                })
            })
            .catch(() => {
                toast.error('Failed to load property')
                navigate('/agent/dashboard')
            })
            .finally(() => setLoading(false))
    }, [id, navigate, isEditing])

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files)
        setImageFiles(prev => [...prev, ...files])
        const previews = files.map(f => URL.createObjectURL(f))
        setImagePreviews(prev => [...prev, ...previews])
    }

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const executeSubmit = async () => {
        try {
            const payload = { 
                ...form, 
                pricePerNight: Number(form.pricePerNight), 
                bedrooms: Number(form.bedrooms), 
                bathrooms: Number(form.bathrooms), 
                maxGuests: Number(form.maxGuests) 
            }
            
            let savedProperty
            if (isEditing) {
                const { data } = await propertyAPI.update(id, payload)
                savedProperty = data
                toast.success('Property updated!')
            } else {
                const { data } = await propertyAPI.create(payload)
                savedProperty = data
                toast.success('Property created!')
            }
            
            if (imageFiles.length > 0) {
                await propertyAPI.uploadImages(savedProperty.id, imageFiles)
            }
            
            navigate('/agent/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save property')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEditing && editingProperty && editingProperty.status === 'APPROVED') {
            const requiresReapproval = 
                form.title !== editingProperty.title ||
                form.address !== editingProperty.address ||
                form.city !== editingProperty.city ||
                form.country !== editingProperty.country ||
                form.type !== editingProperty.type ||
                Number(form.bedrooms) !== editingProperty.bedrooms ||
                Number(form.bathrooms) !== editingProperty.bathrooms ||
                Number(form.maxGuests) !== editingProperty.maxGuests ||
                form.latitude !== editingProperty.latitude ||
                form.longitude !== editingProperty.longitude
                
            if (requiresReapproval) {
                setShowEditConfirmModal(true)
                return
            }
        }
        executeSubmit()
    }

    if (loading) {
        return <Layout><div className="animate-pulse card h-96" /></Layout>
    }

    return (
        <Layout>
            {showEditConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#000]/40 backdrop-blur-sm" onClick={() => setShowEditConfirmModal(false)} />
                    <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-title mb-2">Re-approval Required</h2>
                        <p className="text-sm text-muted mb-6">
                            You are about to edit core property details (e.g., location, capacity). This will temporarily hide your property from public listings until an Administrator re-approves it. If rejected, your property will revert to its previously approved state. Do you wish to continue?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowEditConfirmModal(false)} className="btn-secondary text-sm">Cancel</button>
                            <button onClick={executeSubmit} className="btn-primary text-sm" style={{ backgroundColor: '#8c5d36', color: 'white' }}>Continue and Save</button>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/agent/dashboard')}
                    className="flex items-center gap-2 text-muted hover:text-title mb-6 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            
            <PropertyForm 
                form={form}
                setForm={setForm}
                editingProperty={editingProperty}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/agent/dashboard')}
                imagePreviews={imagePreviews}
                onImageSelect={handleImageSelect}
                onRemoveImage={removeImage}
            />
        </Layout>
    )
}
