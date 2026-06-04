const db = require('../config/db');

const testResultModel = {

    save: async (student_id, score, total) => {
        const passed = score >= total * 0.72; // עובר ב-72%
        const [result] = await db.query(
            'INSERT INTO test_results (student_id, score, total, passed) VALUES (?, ?, ?, ?)',
            [student_id, score, total, passed]
        );
        return result.insertId;
    },

    findByStudent: async (student_id) => {
        const [rows] = await db.query(
            'SELECT * FROM test_results WHERE student_id = ? ORDER BY taken_at DESC',
            [student_id]
        );
        return rows;
    },

    getLastResult: async (student_id) => {
        const [rows] = await db.query(
            'SELECT * FROM test_results WHERE student_id = ? ORDER BY taken_at DESC LIMIT 1',
            [student_id]
        );
        return rows[0];
    },
};

module.exports = testResultModel;