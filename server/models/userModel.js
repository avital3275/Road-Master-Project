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
            'SELECT id, full_name, email, phone, region, role, license_type FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (full_name, email, password, role, license_type, phone, region) => {
        const [result] = await db.query(
            `INSERT INTO users (full_name, email, password, role, license_type, phone, region)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, password, role, license_type, phone || null, region || null]
        );
        return result.insertId;
    },

    updateProfile: async (id, phone, region) => {
        await db.query(
            `UPDATE users SET phone = ?, region = ? WHERE id = ?`,
            [phone, region, id]
        );
    },

    updatePhoneOnly: async (id, phone) => {
        await db.query(
            `UPDATE users SET phone = ? WHERE id = ?`,
            [phone, id]
        );
    },

    findByRole: async (role) => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, region, role, license_type FROM users WHERE role = ?',
            [role]
        );
        return rows;
    },

    findByRoleAndRegion: async (role, region) => {
        const [rows] = await db.query(
            `SELECT id, full_name, email, phone, region, role, license_type
             FROM users WHERE role = ? AND region = ?`,
            [role, region]
        );
        return rows;
    },

    findMyStudents: async (teacher_id) => {
        const [rows] = await db.query(
            `SELECT DISTINCT u.id, u.full_name, u.email, u.phone, u.license_type
             FROM users u
             JOIN lessons l ON l.student_id = u.id
             WHERE l.teacher_id = ?`,
            [teacher_id]
        );
        return rows;
    },
};

module.exports = userModel;