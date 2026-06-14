const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/teachers', authMiddleware, roleMiddleware(['student']), userController.getTeachers);
router.get('/my-students', authMiddleware, roleMiddleware(['teacher']), userController.getMyStudents);

module.exports = router;