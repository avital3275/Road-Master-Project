import BASE_URL from './api';

const userService = {

    // שליפת כל המורים (לתלמיד)
    getTeachers: async (token) => {
        const res = await fetch(`${BASE_URL}/users/teachers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    // שליפת התלמידים שלי (למורה)
    getMyStudents: async (token) => {
        const res = await fetch(`${BASE_URL}/users/my-students`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    // שליפת פרופיל משתמש
    getProfile: async (token) => {
        const res = await fetch(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },
};

export default userService;