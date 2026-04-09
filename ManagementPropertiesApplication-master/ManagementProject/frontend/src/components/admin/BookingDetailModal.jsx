import React from 'react';
import { BookingCard } from '../booking/BookingCard';
import { Modal } from '../ui/Modal';

export const BookingDetailModal = ({ booking, isOpen, onClose, onAction }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Booking Details"
            subtitle="Full information and management actions"
            maxWidth="max-w-4xl"
        >
            <BookingCard 
                booking={booking} 
                onAction={onAction} 
                isAgent={true} // Allow Admin to use agent actions
            />
        </Modal>
    );
};
