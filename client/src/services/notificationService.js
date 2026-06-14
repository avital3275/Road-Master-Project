import BASE_URL from './api';

const notificationService = {

    getMyNotifications: async (token) => {
        const res = await fetch(`${BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    markAsRead: async (id, token) => {
        const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    markAllAsRead: async (token) => {
        const res = await fetch(`${BASE_URL}/notifications/read-all`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    deleteNotification: async (id, token) => {
        const res = await fetch(`${BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },
};

export default notificationService;