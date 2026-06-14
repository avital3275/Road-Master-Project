const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { sendVerificationCode } = require('../utils/mailer');

const verificationCodes = new Map();

const authController = {

    sendCode: async (req, res) => {
        const { full_name, email, password, role, license_type, phone, region } = req.body;
        try {
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'האימייל כבר רשום במערכת' });
            }

            const existing = verificationCodes.get(email);

            if (existing && existing.attempts >= 5) {
                if (Date.now() < existing.blockedUntil) {
                    const minutesLeft = Math.ceil((existing.blockedUntil - Date.now()) / 60000);
                    return res.status(429).json({
                        message: `חרגת ממספר הניסיונות, נסה שוב בעוד ${minutesLeft} דקות`
                    });
                }
                verificationCodes.delete(email);
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 5 * 60 * 1000;
            const attempts = existing ? existing.attempts + 1 : 1;
            const blockedUntil = attempts >= 5 ? Date.now() + 10 * 60 * 1000 : null;

            verificationCodes.set(email, {
                code,
                expiresAt,
                attempts,
                blockedUntil,
                userData: { full_name, email, password, role, license_type, phone, region },
            });

            const message = attempts === 5
                ? 'קוד אימות נשלח — זהו הניסיון האחרון שלך!'
                : `קוד אימות נשלח לאימייל שלך (ניסיון ${attempts} מתוך 5)`;

            res.status(200).json({ message });

            sendVerificationCode(email, code)
                .catch(err => console.error('שגיאת מייל:', err.message));

        } catch (err) {
            res.status(500).json({ message: 'שגיאה בשליחת האימייל', error: err.message });
        }
    },

    verifyAndRegister: async (req, res) => {
        const { email, code } = req.body;

        try {
            const record = verificationCodes.get(email);
            if (!record) return res.status(400).json({ message: 'לא נמצא קוד אימות — שלח קוד חדש' });
            if (Date.now() > record.expiresAt) {
                verificationCodes.delete(email);
                return res.status(400).json({ message: 'קוד האימות פג תוקף — חזור ושלח קוד חדש' });
            }
            if (record.code !== code) return res.status(400).json({ message: 'קוד האימות שגוי' });

            const { full_name, email: userEmail, password, role, license_type, phone, region } = record.userData;

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserId = await userModel.create(
                full_name, userEmail, hashedPassword, role, license_type, phone, region
            );

            verificationCodes.delete(email);
            res.status(201).json({ message: 'נרשמת בהצלחה!', userId: newUserId });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await userModel.findByEmail(email);
            if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'סיסמה שגויה' });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({
                message: 'התחברת בהצלחה!',
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    region: user.region,
                    role: user.role,
                    license_type: user.license_type,
                },
            });

        } catch (err) {
            res.status(500).json({ message: 'שגיאת שרת', error: err.message });
        }
    },
};

module.exports = authController;