const express        = require('express');
const router         = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/users/profile
router.get('/profile',     authMiddleware,                            userController.getProfile);

// GET /api/users/teachers
router.get('/teachers',    authMiddleware, roleMiddleware(['student']), userController.getTeachers);

// GET /api/users/my-students
router.get('/my-students', authMiddleware, roleMiddleware(['teacher']), userController.getMyStudents);

module.exports = router;