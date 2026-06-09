import BASE_URL from './api';

const theoryService = {

    getExam: async (token) => {
        const res = await fetch(`${BASE_URL}/theory/exam`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    submitExam: async (score, total, token) => {
        const res = await fetch(`${BASE_URL}/theory/exam`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ score, total }),
        });
        return res.json();
    },

    getHistory: async (token) => {
        const res = await fetch(`${BASE_URL}/theory/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getStudentHistory: async (studentId, token) => {
        const res = await fetch(`${BASE_URL}/theory/history/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getQuestions: async (license_type = '', token) => {
        const url = license_type
            ? `${BASE_URL}/theory/questions?license=${license_type}`
            : `${BASE_URL}/theory/questions`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getSigns: async (token) => {
        const res = await fetch(`${BASE_URL}/theory/signs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    addQuestion: async (formData, token) => {
        const res = await fetch(`${BASE_URL}/theory/question`, {
            method:  'POST',
            headers: { Authorization: `Bearer ${token}` },
            body:    formData,
        });
        return res.json();
    },

    deleteQuestion: async (id, token) => {
        const res = await fetch(`${BASE_URL}/theory/question/${id}`, {
            method:  'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },
};

export default theoryService;