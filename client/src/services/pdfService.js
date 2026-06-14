import BASE_URL from './api';

const pdfService = {

    sendReport: async (reportData, token) => {
        const res = await fetch(`${BASE_URL}/pdf/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reportData),
        });
        return res.json();
    },
};

export default pdfService;