const db = require('../config/db');

const lessonModel = {

    findByStudent: async (student_id) => {
        const [rows] = await db.query(
            `SELECT l.*, u.full_name AS teacher_name 
             FROM lessons l
             JOIN users u ON l.teacher_id = u.id
             WHERE l.student_id = ?
             ORDER BY l.lesson_date DESC`,
            [student_id]
        );
        return rows;
    },

    findByTeacher: async (teacher_id) => {
        const [rows] = await db.query(
            `SELECT l.*, u.full_name AS student_name 
             FROM lessons l
             JOIN users u ON l.student_id = u.id
             WHERE l.teacher_id = ?
             ORDER BY l.lesson_date DESC`,
            [teacher_id]
        );
        return rows;
    },

    create: async (teacher_id, student_id, lesson_date) => {
        const [result] = await db.query(
            'INSERT INTO lessons (teacher_id, student_id, lesson_date) VALUES (?, ?, ?)',
            [teacher_id, student_id, lesson_date]
        );
        return result.insertId;
    },

    updateStatus: async (id, status, notes) => {
        await db.query(
            'UPDATE lessons SET status = ?, notes = ? WHERE id = ?',
            [status, notes, id]
        );
    },

    bookLesson: async (teacher_id, student_id, lesson_date) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [existing] = await connection.query(
                `SELECT id FROM lessons 
                 WHERE teacher_id = ? AND lesson_date = ? 
                 AND status = "scheduled" FOR UPDATE`,
                [teacher_id, lesson_date]
            );

            if (existing.length > 0) {
                await connection.rollback();
                return { conflict: true };
            }

            const [result] = await connection.query(
                'INSERT INTO lessons (teacher_id, student_id, lesson_date) VALUES (?, ?, ?)',
                [teacher_id, student_id, lesson_date]
            );

            await connection.commit();
            return { conflict: false, insertId: result.insertId };

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },
};

module.exports = lessonModel;