const db = require('../config/db');

const userModel = {

    findByEmail: async (email) => {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, role, license_type FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (full_name, email, password, role, license_type) => {
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password, role, license_type) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, password, role, license_type]
        );
        return result.insertId;
    },

    // ✅ חדש — שליפת כל המורים
    findByRole: async (role) => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, role, license_type FROM users WHERE role = ?',
            [role]
        );
        return rows;
    },

    // ✅ חדש — שליפת תלמידים שיש להם שיעור עם המורה
    findMyStudents: async (teacher_id) => {
        const [rows] = await db.query(
            `SELECT DISTINCT u.id, u.full_name, u.email, u.license_type
             FROM users u
             JOIN lessons l ON l.student_id = u.id
             WHERE l.teacher_id = ?`,
            [teacher_id]
        );
        return rows;
    },
};

module.exports = userModel;