export const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${color}`}>
            {Icon && <Icon size={20} className="text-white" />}
        </div>
        <div>
            <p className="text-2xl font-semibold text-title">{value ?? '—'}</p>
            <p className="text-xs text-muted">{label}</p>
        </div>
    </div>
)
