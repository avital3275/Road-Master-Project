import BASE_URL from './api';

const lessonService = {

    getMyLessons: async (token) => {
        const res = await fetch(`${BASE_URL}/lessons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getSlots: async (teacherId, token) => {
        const res = await fetch(`${BASE_URL}/lessons/slots/${teacherId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getMySlots: async (token) => {
        const res = await fetch(`${BASE_URL}/lessons/my-slots`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    addSlot: async (slot_date, token) => {
        const res = await fetch(`${BASE_URL}/lessons/slots`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ slot_date }),
        });
        return res.json();
    },

    bookLesson: async (teacher_id, lesson_date, token) => {
        const res = await fetch(`${BASE_URL}/lessons`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ teacher_id, lesson_date }),
        });
        return res.json();
    },

    updateLesson: async (id, status, notes, token) => {
        const res = await fetch(`${BASE_URL}/lessons/${id}`, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ status, notes }),
        });
        return res.json();
    },

    getStudentLessons: async (studentId, token) => {
        const res = await fetch(`${BASE_URL}/lessons/student/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },
};

export default lessonService;