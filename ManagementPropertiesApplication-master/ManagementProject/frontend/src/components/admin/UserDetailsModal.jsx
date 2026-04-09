import React from 'react';
import { Mail, Phone, Shield, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { formatDate } from '../../utils/formatters';

export const UserDetailsModal = ({ user, isOpen, onClose }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            className="!p-0" // Remove padding to handle custom cover image
            maxWidth="max-w-lg"
        >
            {/* Header/Cover with Avatar */}
            <div className="relative h-32 bg-gradient-to-br from-[#8c5d36] to-[#af8260]">
                <div className="absolute -bottom-10 left-8">
                    <div className="p-1.5 bg-surface rounded-3xl shadow-lg">
                        <Avatar size="lg" name={user ? `${user.firstName} ${user.lastName}` : 'User'} />
                    </div>
                </div>
            </div>

            <div className="pt-14 pb-4 px-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-title">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-gray-400 font-medium text-sm">{user?.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                         <Badge status={user?.active ? 'active' : 'inactive'} />
                         {user?.verified && <Badge status="active" className="!bg-green-50 !text-green-600" />}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-background rounded-2xl border border-border">
                        <p className="text-[10px] uppercase font-bold text-muted mb-2 flex items-center gap-1.5">
                            <Shield size={10} /> Role
                        </p>
                        <p className="text-sm font-bold text-title">
                            {user?.role?.replace('ROLE_', '')}
                        </p>
                    </div>
                    <div className="p-4 bg-background rounded-2xl border border-border">
                        <p className="text-[10px] uppercase font-bold text-muted mb-2 flex items-center gap-1.5">
                            <Calendar size={10} /> Joined
                        </p>
                        <p className="text-sm font-bold text-title">
                            {formatDate(user?.createdAt, { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Contact Information</h3>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand/20 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-gray-400 group-hover:bg-brand/5 group-hover:text-brand transition-colors">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email Address</p>
                            <p className="text-sm font-bold text-title">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand/20 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-gray-400 group-hover:bg-brand/5 group-hover:text-brand transition-colors">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                            <p className="text-sm font-bold text-title">{user?.phone || 'No phone provided'}</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => window.location.href = `mailto:${user?.email}`}
                    className="w-full mt-8 py-4 bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-hover transition-all shadow-lg active:scale-[0.98]"
                >
                    Send Message <ExternalLink size={16} />
                </button>
            </div>
        </Modal>
    );
};
