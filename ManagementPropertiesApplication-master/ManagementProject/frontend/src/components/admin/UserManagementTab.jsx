import { Trash2, ShieldCheck, Eye } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { useNavigate } from 'react-router-dom'

export const UserManagementTab = ({ users, onDeleteUser, onRoleChange, onToggleVerify, onViewUser }) => {
    const navigate = useNavigate()
    const thCls = 'text-left px-4 py-2.5 text-xs font-medium text-muted bg-surface-hover border-b border-gray-100'
    const tdCls = 'px-4 py-3 text-sm text-title'
    const trCls = 'border-b border-gray-50 hover:bg-surface-hover transition-colors'

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-surface">
            <table className="w-full">
                <thead>
                    <tr>
                        {['Name', 'Email', 'Role', 'Status', 'Verified', 'Actions'].map(h => (
                            <th key={h} className={thCls}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No users found</td></tr>
                    )}
                    {users.map(u => (
                        <tr key={u.id} className={trCls}>
                            <td className={tdCls}>
                                <div className="flex items-center">
                                    <Avatar name={`${u.firstName} ${u.lastName}`} />
                                    <button 
                                        onClick={() => navigate(`/profile/${u.id}`)}
                                        className="font-medium hover:text-brand transition-colors"
                                    >
                                        {u.firstName} {u.lastName}
                                    </button>
                                </div>
                            </td>
                            <td className={`${tdCls} text-muted`}>{u.email}</td>
                            <td className={tdCls}>
                                <select
                                    className="text-xs border border-border rounded-md px-2 py-1 bg-surface focus:outline-none focus:ring-1 focus:ring-brand"
                                    value={u.role?.replace('ROLE_', '')}
                                    onChange={e => onRoleChange(u.id, e.target.value)}
                                >
                                    {['ADMIN', 'AGENT', 'USER'].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </td>
                            <td className={tdCls}><Badge status={u.active ? 'active' : 'inactive'} /></td>
                            <td className={tdCls}>
                                <div className="flex items-center gap-1">
                                    {u.role === 'ROLE_AGENT' ? (
                                        <button 
                                            onClick={() => onToggleVerify(u.id)}
                                            className={`transition-colors p-1 rounded-lg ${u.verified ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}
                                            title={u.verified ? 'Verified Agent' : 'Click to verify'}
                                        >
                                            <ShieldCheck size={18} fill={u.verified ? 'currentColor' : 'none'} />
                                        </button>
                                    ) : (
                                        <div className="w-7" /> // spacer
                                    )}

                                    <button 
                                        onClick={() => onViewUser(u.id)}
                                        className="p-1 rounded-lg text-gray-400 hover:text-brand hover:bg-background transition-colors"
                                        title="View full details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </td>
                            <td className={tdCls}>
                                <button onClick={() => onDeleteUser(u.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete user">
                                    <Trash2 size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
