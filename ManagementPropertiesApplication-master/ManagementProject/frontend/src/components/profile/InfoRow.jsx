import React from 'react';

/**
 * A standardized row for displaying user information with an icon and label.
 */
export const InfoRow = ({ icon, label, value, empty }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-brand-50/50 dark:bg-brand-900/10 hover:bg-brand-100/50 dark:hover:bg-brand-900/20 border border-border-warm rounded-2xl transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-800/30 flex items-center justify-center text-brand flex-shrink-0 shadow-sm border border-brand-200 dark:border-brand-700/20">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-sm font-black truncate ${empty ? 'text-muted/40 italic font-medium' : 'text-title'}`}>{value}</p>
            </div>
        </div>
    );
};
