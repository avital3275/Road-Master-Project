const questionModel = require('../models/questionModel');
const testResultModel = require('../models/testResultModel');
const userModel = require('../models/userModel');

const theoryController = {

    getExam: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            const questions = await questionModel.getRandom(30, user.license_type);
            res.status(200).json(questions);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    submitExam: async (req, res) => {
        const { score, total } = req.body;
        const student_id = req.user.id;

        try {
            const resultId = await testResultModel.save(student_id, score, total);
            const passed = score >= total * 0.72;

            res.status(201).json({
                message: passed ? 'כל הכבוד, עברת!' : 'לא עברת, נסה שוב!',
                passed,
                score,
                total,
                resultId,
            });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    addQuestion: async (req, res) => {
        const { question_text, option_a, option_b, option_c, option_d, correct_answer, license_type } = req.body;
        const image_path = req.file ? `/uploads/signs/${req.file.filename}` : null;

        try {
            const newId = await questionModel.create(
                question_text, image_path,
                option_a, option_b, option_c, option_d,
                correct_answer,license_type
            );
            res.status(201).json({ message: 'השאלה נוספה בהצלחה!', questionId: newId });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    deleteQuestion: async (req, res) => {
        const { id } = req.params;

        try {
            await questionModel.delete(id);
            res.status(200).json({ message: 'השאלה נמחקה בהצלחה!' });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    getHistory: async (req, res) => {
        const student_id = req.user.id;

        try {
            const history = await testResultModel.findByStudent(student_id);
            res.status(200).json(history);

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
};

module.exports = theoryController;