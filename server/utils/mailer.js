const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendVerificationCode = async (email, code) => {
    try {
        await transporter.sendMail({
            from: `"RoadMaster" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'קוד אימות - RoadMaster',
            html: `
                <div style="font-family: Arial; text-align: center; padding: 20px; direction: rtl;">
                    <h2>ברוך הבא ל־RoadMaster!</h2>
                    <p>קוד האימות שלך הוא:</p>
                    <h1 style="color: #7BA05B; font-size: 40px; letter-spacing: 8px;">${code}</h1>
                    <p>הקוד תקף למשך <strong>דקה אחת</strong> בלבד.</p>
                </div>
            `,
        });
    } catch (err) {
        console.error('שגיאת מייל:', err.message);
        throw err;
    }
};

const sendReportEmail = async (email, studentName, teacherName, filePath) => {
    try {
        await transporter.sendMail({
            from: `"RoadMaster" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'דו"ח התקדמות - RoadMaster',
            html: `
                <div style="font-family: Arial; padding: 20px; direction: rtl;">
                    <h2>שלום ${studentName},</h2>
                    <p>מצורף בזאת דו"ח התקדמות מאת המורה ${teacherName}</p>
                    <p>ניתן לצפות בדו"ח גם דרך האתר.</p>
                    <br/>
                    <p>בהצלחה,<br/>צוות RoadMaster</p>
                </div>
            `,
            attachments: [{
                filename: 'דוח_התקדמות.pdf',
                path: filePath,
            }],
        });
    } catch (err) {
        console.error('שגיאת שליחת דו"ח:', err.message);
        throw err;
    }
};

module.exports = { sendVerificationCode, sendReportEmail };