const userModel = require('../models/userModel');

const userController = {

    getProfile: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    updateProfile: async (req, res) => {
        const { phone, region } = req.body;
        const { role } = req.user;
        try {
            if (role === 'teacher') {
                await userModel.updateProfile(req.user.id, phone, region);
            } else {
                await userModel.updatePhoneOnly(req.user.id, phone);
            }
            const updated = await userModel.findById(req.user.id);
            res.status(200).json({ message: 'הפרופיל עודכן בהצלחה!', user: updated });
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    getTeachers: async (req, res) => {
        const { region } = req.query;
        try {
            const teachers = region
                ? await userModel.findByRoleAndRegion('teacher', region)
                : await userModel.findByRole('teacher');
            res.status(200).json(teachers);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

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