import api from './axios'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
    login:          (data) => api.post('/auth/login', data),
    register:       (data) => api.post('/auth/register', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword:  (data) => api.post('/auth/reset-password', data),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
    getAll:           ()         => api.get('/users'),
    getById:          (id)       => api.get(`/users/${id}`),
    getCurrentUser:   ()         => api.get('/users/me'),
    updateMe:         (data)     => api.put('/users/me', data),
    update:           (id, data) => api.put(`/users/${id}`, data),
    delete:           (id)       => api.delete(`/users/${id}`),
    changeRole:       (id, role) => api.patch(`/users/${id}/role?role=${role}`),
    verify:           (id)       => api.patch(`/users/${id}/verify`),
    getPublicProfile: (id)       => api.get(`/users/${id}/public`),
}

// ─── Properties ───────────────────────────────────────────────────────────────
export const propertyAPI = {
    getAll:          (params) => api.get('/properties', { params }),
    getById:         (id)     => api.get(`/properties/${id}`),
    create:          (data)   => api.post('/properties', data),
    update:          (id, data) => api.put(`/properties/${id}`, data),
    delete:          (id)     => api.delete(`/properties/${id}`),
    toggleAvail:     (id)     => api.patch(`/properties/${id}/availability`),
    getMyListings:   (params) => api.get('/properties/my-listings', { params }),
    getAllAdmin: (params) => api.get('/properties/admin/all', { params }),

    uploadImages: (id, files) => {
        const formData = new FormData()
        files.forEach(f => formData.append('files', f))
        return api.post(`/properties/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainImage: (propertyId, imageId) => api.patch(`/properties/${propertyId}/images/${imageId}/main`),
    getPending: (params) => api.get('/properties/admin/pending', { params }),
    approve:    (id)     => api.patch(`/properties/admin/${id}/approve`),
    reject:     (id)     => api.patch(`/properties/admin/${id}/reject`),
    geocodeAll: ()       => api.post('/properties/admin/geocode-all'),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
    getAll:          (params)     => api.get('/bookings/agent', { params }),
    getById:         (id)         => api.get(`/bookings/${id}`),
    getMyBookings:   (params)     => api.get('/bookings/my-bookings', { params }),
    getByProperty:   (id, params) => api.get(`/bookings/property/${id}`, { params }),
    create:          (data)       => api.post('/bookings', data),
    cancel:          (id)         => api.patch(`/bookings/${id}/cancel`),
    confirm:         (id)         => api.patch(`/bookings/${id}/confirm`),
    reject:          (id)         => api.patch(`/bookings/${id}/reject`),
    delete:          (id)         => api.delete(`/bookings/${id}`),
    getBookedDates: (id) => api.get(`/bookings/property/${id}/booked-dates`),
}
export const reviewAPI = {
    getByProperty: (propertyId, params) => api.get(`/reviews/property/${propertyId}`, { params }),
    canReview:     (propertyId)         => api.get(`/reviews/property/${propertyId}/can-review`),
    create:        (data)               => api.post('/reviews', data),
    delete:        (id)                 => api.delete(`/reviews/${id}`),
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export const chatAPI = {
    getMessages: (sId, rId) => api.get(`/chat/messages/${sId}/${rId}`),
    getRooms:    (userId)    => api.get(`/chat/rooms/${userId}`),
}