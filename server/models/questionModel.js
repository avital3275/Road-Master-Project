const db = require('../config/db');

const questionModel = {

    getRandom: async (amount, license_type) => {
        const [rows] = await db.query(
            'SELECT * FROM questions WHERE license_type = ? ORDER BY RAND() LIMIT ?',
            [license_type, amount]
        );
        return rows;
    },

    getAll: async (license_type = null) => {
        if (license_type) {
            const [rows] = await db.query(
                'SELECT * FROM questions WHERE license_type = ?',
                [license_type]
            );
            return rows;
        }
        const [rows] = await db.query('SELECT * FROM questions');
        return rows;
    },

    create: async (question_text, image_path, option_a, option_b, option_c, option_d, correct_answer, license_type) => {
        const [result] = await db.query(
            `INSERT INTO questions 
         (question_text, image_path, option_a, option_b, option_c, option_d, correct_answer, license_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [question_text, image_path, option_a, option_b, option_c, option_d, correct_answer, license_type]
        );
        return result.insertId;
    },

    delete: async (id) => {
        await db.query('DELETE FROM questions WHERE id = ?', [id]);
    },
};

module.exports = questionModel;