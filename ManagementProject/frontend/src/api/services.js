import api from './axios'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
    login:    (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
    getAll:        ()         => api.get('/users'),
    getById:       (id)       => api.get(`/users/${id}`),
    getMe:         ()         => api.get('/users/me'),
    updateMe:      (data)     => api.put('/users/me', data),
    update:        (id, data) => api.put(`/users/${id}`, data),
    delete:        (id)       => api.delete(`/users/${id}`),
    changeRole:    (id, role) => api.patch(`/users/${id}/role?role=${role}`),
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
    uploadImages: (id, files) => {
        const formData = new FormData()
        files.forEach(f => formData.append('files', f))
        return api.post(`/properties/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainImage: (propertyId, imageId) => api.patch(`/properties/${propertyId}/images/${imageId}/main`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
    getAll:          (params)     => api.get('/bookings', { params }),
    getById:         (id)         => api.get(`/bookings/${id}`),
    getMyBookings:   (params)     => api.get('/bookings/my-bookings', { params }),
    getByProperty:   (id, params) => api.get(`/bookings/property/${id}`, { params }),
    create:          (data)       => api.post('/bookings', data),
    cancel:          (id)         => api.patch(`/bookings/${id}/cancel`),
    confirm:         (id)         => api.patch(`/bookings/${id}/confirm`),
    reject:          (id)         => api.patch(`/bookings/${id}/reject`),
    delete:          (id)         => api.delete(`/bookings/${id}`),
}