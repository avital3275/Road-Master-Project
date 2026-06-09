const lessonModel = require('../models/lessonModel');

const lessonController = {

    getMyLessons: async (req, res) => {
        try {
            const { id, role } = req.user;

            const lessons = role === 'teacher'
                ? await lessonModel.findByTeacher(id)
                : await lessonModel.findByStudent(id);

            res.status(200).json(lessons);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    bookLesson: async (req, res) => {
        const { teacher_id, lesson_date } = req.body;
        const student_id = req.user.id;

        try {
            const result = await lessonModel.bookLesson(
                teacher_id,
                student_id,
                lesson_date
            );

            if (result.conflict) {
                return res.status(409).json({
                    message: 'המועד הזה כבר תפוס, אנא בחר מועד אחר'
                });
            }

            res.status(201).json({
                message: 'השיעור תואם בהצלחה!',
                lessonId: result.insertId
            });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
    updateLesson: async (req, res) => {
        const { id } = req.params;
        const { status, notes } = req.body;

        try {
            await lessonModel.updateStatus(id, status, notes);
            res.status(200).json({ message: 'השיעור עודכן בהצלחה!' });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    getSlotsByTeacher: async (req, res) => {
        const { teacherId } = req.params;

        try {
            const slots = await lessonModel.getSlotsByTeacher(teacherId);
            res.status(200).json(slots);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    getMySlots: async (req, res) => {
        try {
            const slots = await lessonModel.getSlotsByTeacher(req.user.id);
            res.status(200).json(slots);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    addSlot: async (req, res) => {
        const { slot_date } = req.body;
        const teacher_id = req.user.id;

        try {
            const slot = await lessonModel.addSlot(teacher_id, slot_date);
            res.status(201).json(slot);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
    getStudentLessons: async (req, res) => {
        const { studentId } = req.params;

        try {
            const lessons = await lessonModel.findByStudent(studentId);
            res.status(200).json(lessons);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    }

};

module.exports = lessonController;