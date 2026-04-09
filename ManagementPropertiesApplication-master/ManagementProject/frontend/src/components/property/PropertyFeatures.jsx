import { BedDouble, Bath, Users } from 'lucide-react'

export const PropertyFeatures = ({ bedrooms, bathrooms, maxGuests }) => {
    const features = [
        {
            icon: BedDouble,
            label: 'Bedrooms',
            value: `${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}`,
        },
        {
            icon: Bath,
            label: 'Bathrooms',
            value: `${bathrooms} bathroom${bathrooms !== 1 ? 's' : ''}`,
        },
        {
            icon: Users,
            label: 'Capacity',
            value: `Up to ${maxGuests} guest${maxGuests !== 1 ? 's' : ''}`,
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, label, value }) => (
                <div
                    key={label}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border-warm hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
                >
                    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 group-hover:rotate-3">
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">
                            {label}
                        </p>
                        <p className="text-sm font-bold text-title">
                            {value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}