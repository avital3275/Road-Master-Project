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
};

module.exports = userModel;