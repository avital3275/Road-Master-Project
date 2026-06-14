import BASE_URL from './api';

const authService = {

    sendCode: async (userData) => {
        const res = await fetch(`${BASE_URL}/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return res.json();
    },

    verifyAndRegister: async (email, code) => {
        const res = await fetch(`${BASE_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        return res.json();
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },
};

export default authService;