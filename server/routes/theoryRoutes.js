const express          = require('express');
const router           = express.Router();
const theoryController = require('../controllers/theoryController');
const authMiddleware   = require('../middleware/authMiddleware');
const roleMiddleware   = require('../middleware/roleMiddleware');
const multer           = require('multer');
const path             = require('path');

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

// GET /api/theory/exam
router.get('/exam',            authMiddleware,                            theoryController.getExam);

// POST /api/theory/exam
router.post('/exam',           authMiddleware, roleMiddleware(['student']), theoryController.submitExam);

// GET /api/theory/history
router.get('/history',         authMiddleware, roleMiddleware(['student']), theoryController.getHistory);

// ✅ חדש — GET /api/theory/history/:studentId (למורה)
router.get('/history/:studentId', authMiddleware, roleMiddleware(['teacher']), theoryController.getStudentHistory);

// ✅ חדש — GET /api/theory/signs
router.get('/signs',           authMiddleware, theoryController.getSigns);

// ✅ חדש — GET /api/theory/questions
router.get('/questions',       authMiddleware, roleMiddleware(['teacher']), theoryController.getQuestions);

// POST /api/theory/question
router.post('/question',       authMiddleware, roleMiddleware(['teacher']), upload.single('image'), theoryController.addQuestion);

// DELETE /api/theory/question/:id
router.delete('/question/:id', authMiddleware, roleMiddleware(['teacher']), theoryController.deleteQuestion);

module.exports = router;