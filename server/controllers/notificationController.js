const notificationModel = require('../models/notificationModel');

const notificationController = {

    getMyNotifications: async (req, res) => {
        try {
            const notifications = await notificationModel.findByUser(req.user.id);
            res.status(200).json(notifications);
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    markAsRead: async (req, res) => {
        const { id } = req.params;
        try {
            await notificationModel.markAsRead(id, req.user.id);
            res.status(200).json({ message: 'סומן כנקרא' });
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    markAllAsRead: async (req, res) => {
        try {
            await notificationModel.markAllAsRead(req.user.id);
            res.status(200).json({ message: 'כל ההתראות סומנו כנקראו' });
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    deleteNotification: async (req, res) => {
        const { id } = req.params;
        try {
            await notificationModel.delete(id, req.user.id);
            res.status(200).json({ message: 'ההתראה נמחקה' });
        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
};

module.exports = notificationController;