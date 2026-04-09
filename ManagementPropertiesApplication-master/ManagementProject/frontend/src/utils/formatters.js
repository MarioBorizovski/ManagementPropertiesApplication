/**
 * Utility functions for formatting data across the application.
 */

// Centralized Backend URL (Derived from VITE_API_URL or defaults to empty for relative paths)
const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : '';

/**
 * Resolves an image path to a full URL.
 * Handles both absolute (http) and relative backend paths.
 */
export const resolveImageUrl = (path, placeholder = '/placeholder-house.png') => {
    if (!path) return placeholder;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * Formats a number as USD currency.
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount || 0);
};

/**
 * Formats a date string into a readable format.
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';
    const defaultOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        ...options 
    };
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Maps status/role codes to display labels.
 */
export const formatEnum = (value) => {
    if (!value) return '';
    return value.replace('ROLE_', '').replace('_', ' ').toLowerCase();
};
