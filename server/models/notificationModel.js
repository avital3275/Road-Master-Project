const db = require('../config/db');

const notificationModel = {

    create: async (user_id, title, body, type = 'general', file_path = null) => {
        const [result] = await db.query(
            `INSERT INTO notifications (user_id, title, body, type, file_path)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, title, body, type, file_path]
        );
        return result.insertId;
    },

    findByUser: async (user_id) => {
        const [rows] = await db.query(
            `SELECT * FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [user_id]
        );
        return rows;
    },

    markAsRead: async (id, user_id) => {
        await db.query(
            `UPDATE notifications SET is_read = TRUE
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );
    },

    markAllAsRead: async (user_id) => {
        await db.query(
            `UPDATE notifications SET is_read = TRUE
             WHERE user_id = ?`,
            [user_id]
        );
    },

    delete: async (id, user_id) => {
        await db.query(
            `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );
    },
};

module.exports = notificationModel;