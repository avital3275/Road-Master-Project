const userModel = require('../models/userModel');

const userController = {

    getProfile: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'משתמש לא נמצא' });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    // ✅ חדש — שליפת כל המורים
    getTeachers: async (req, res) => {
        try {
            const teachers = await userModel.findByRole('teacher');
            res.status(200).json(teachers);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    // ✅ חדש — שליפת תלמידים של מורה
    getMyStudents: async (req, res) => {
        try {
            const students = await userModel.findMyStudents(req.user.id);
            res.status(200).json(students);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
};

module.exports = userController;