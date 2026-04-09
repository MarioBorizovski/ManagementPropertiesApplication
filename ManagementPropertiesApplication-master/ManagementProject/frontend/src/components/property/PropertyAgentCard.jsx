import React from 'react';
import { Users, ShieldCheck, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';

/**
 * Displays agent information within the PropertyDetail page.
 */
export const PropertyAgentCard = ({ agentId, agentName, agentVerified, showMessageButton, onMessageClick }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-surface p-8 rounded-[32px] border border-border-warm shadow-sm flex flex-col md:flex-row items-center gap-8 group/agent transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
            <div className="flex items-center gap-6 flex-1">
                <div 
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-surface shadow-xl cursor-pointer group-hover/agent:scale-105 transition-transform ${agentVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}
                    onClick={() => navigate(`/profile/${agentId}`)}
                >
                    <Users size={32} />
                    <div className={`absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-md border ${agentVerified ? 'border-emerald-100' : 'border-slate-100'}`}>
                        <ShieldCheck size={18} className={agentVerified ? 'text-emerald-500 fill-emerald-500/10' : 'text-slate-300'} />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-title tracking-tight mb-1">
                        Hosted by {agentName}
                    </h2>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className={agentVerified ? 'text-emerald-500' : 'text-slate-400'} />
                        <p className={`text-sm font-bold ${agentVerified ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {agentVerified ? 'Verified Host' : 'Agent Unverified'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => navigate(`/profile/${agentId}`)}
                    className="px-6 py-3 text-sm font-black uppercase tracking-widest text-title border-2 border-title rounded-2xl hover:bg-title hover:text-white transition-all duration-300"
                >
                    Profile
                </button>
                {showMessageButton && (
                    <button
                        onClick={onMessageClick}
                        className="px-6 py-3 text-sm font-black uppercase tracking-widest bg-brand text-white border-2 border-brand rounded-2xl hover:bg-brand-hover hover:border-brand-hover transition-all duration-300 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
                    >
                        <MessageSquare size={16} />
                        Message
                    </button>
                )}
            </div>
        </div>
    );
};
