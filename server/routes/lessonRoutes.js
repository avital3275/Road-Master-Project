const express          = require('express');
const router           = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware   = require('../middleware/authMiddleware');
const roleMiddleware   = require('../middleware/roleMiddleware');

router.get('/',    authMiddleware,                           lessonController.getMyLessons);

router.post('/',   authMiddleware, roleMiddleware(['student']), lessonController.bookLesson);

router.put('/:id', authMiddleware, roleMiddleware(['teacher']), lessonController.updateLesson);

module.exports = router;