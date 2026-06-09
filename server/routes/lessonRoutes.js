const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, lessonController.getMyLessons);
router.get('/my-slots', authMiddleware, roleMiddleware(['teacher']), lessonController.getMySlots);
router.get('/slots/:teacherId', authMiddleware, lessonController.getSlotsByTeacher);
router.get('/student/:studentId', authMiddleware, roleMiddleware(['teacher']), lessonController.getStudentLessons);
router.post('/', authMiddleware, roleMiddleware(['student']), lessonController.bookLesson);
router.post('/slots', authMiddleware, roleMiddleware(['teacher']), lessonController.addSlot);
router.put('/:id', authMiddleware, roleMiddleware(['teacher']), lessonController.updateLesson);

module.exports = router;