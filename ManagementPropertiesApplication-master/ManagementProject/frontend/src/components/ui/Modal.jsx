import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Glassmorphism Modal component.
 */
export const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    children, 
    maxWidth = 'max-w-lg',
    className = '' 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000]/40 backdrop-blur-sm transition-all duration-300">
            <div className={`bg-surface rounded-[2.5rem] w-full ${maxWidth} overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 ${className}`}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 bg-gray-100 hover:bg-brand/10 text-gray-400 hover:text-brand rounded-full transition-all hover:scale-110 active:scale-95"
                >
                    <X size={20} />
                </button>

                <div className="pt-10 pb-8 px-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    {(title || subtitle) && (
                        <div className="mb-6 pr-10">
                            {title && <h2 className="text-2xl font-black text-title">{title}</h2>}
                            {subtitle && <p className="text-gray-400 font-medium text-sm">{subtitle}</p>}
                        </div>
                    )}
                    
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
};
