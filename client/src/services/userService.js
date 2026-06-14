import BASE_URL from './api';

const userService = {

    getTeachers: async (token, region = '') => {
        const url = region
            ? `${BASE_URL}/users/teachers?region=${encodeURIComponent(region)}`
            : `${BASE_URL}/users/teachers`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    getMyStudents: async (token) => {
        const res = await fetch(`${BASE_URL}/users/my-students`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    getProfile: async (token) => {
        const res = await fetch(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    updateProfile: async (data, token) => {
        const res = await fetch(`${BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};

export default userService;