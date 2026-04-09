import React from 'react';
import { Shield, Clock, CheckCircle, XCircle, Ban, User, Building2, BadgeCheck } from 'lucide-react';

/**
 * A versatile Badge component for Roles and Statuses.
 */
export const Badge = ({ status, variant = 'status', className = '' }) => {
    const config = {
        // Status Variants (Adaptive with Opacity)
        PENDING:   { cls: 'bg-amber-100/80 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',  icon: Clock,       label: 'Pending' },
        CONFIRMED: { cls: 'bg-green-100/80 dark:bg-green-400/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30',  icon: CheckCircle, label: 'Confirmed' },
        APPROVED:  { cls: 'bg-green-100/80 dark:bg-green-400/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30',  icon: CheckCircle, label: 'Approved' },
        REJECTED:  { cls: 'bg-red-100/80 dark:bg-red-400/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30',      icon: XCircle,     label: 'Rejected' },
        CANCELLED: { cls: 'bg-red-100/80 dark:bg-red-400/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/30',      icon: Ban,         label: 'Cancelled' },
        
        // Role Variants
        ROLE_ADMIN: { cls: 'bg-purple-100/80 dark:bg-purple-400/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30', icon: Shield,     label: 'Admin' },
        ROLE_AGENT: { cls: 'bg-indigo-100/80 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30', icon: Building2,  label: 'Agent' },
        ROLE_USER:  { cls: 'bg-emerald-100/80 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30', icon: User,     label: 'User' },
        
        // State Variants
        active:    { cls: 'bg-green-100/80 dark:bg-green-400/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30',  icon: CheckCircle, label: 'Active' },
        inactive:  { cls: 'bg-surface-hover text-muted border-border',     icon: Ban,         label: 'Inactive' },
        verified:  { cls: 'bg-blue-100/80 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',     icon: BadgeCheck,  label: 'Verified' },
    };

    const item = config[status] || { cls: 'bg-surface-hover text-muted border-border', icon: null, label: status };
    const Icon = item.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.cls} ${className}`}>
            {Icon && <Icon size={10} className="shrink-0" />}
            {item.label}
        </span>
    );
};
