const express = require('express');
const router = express.Router();
const theoryController = require('../controllers/theoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/signs');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
});

router.get('/exam', authMiddleware, theoryController.getExam);

router.post('/exam', authMiddleware, roleMiddleware(['student']), theoryController.submitExam);

router.get('/history', authMiddleware, roleMiddleware(['student']), theoryController.getHistory);

router.get('/history/:studentId', authMiddleware, roleMiddleware(['teacher']), theoryController.getStudentHistory);

router.get('/signs', authMiddleware, theoryController.getSigns);

router.get('/questions', authMiddleware, roleMiddleware(['teacher']), theoryController.getQuestions);

router.post('/question', authMiddleware, roleMiddleware(['teacher']), upload.single('image'), theoryController.addQuestion);

router.delete('/question/:id', authMiddleware, roleMiddleware(['teacher']), theoryController.deleteQuestion);

module.exports = router;