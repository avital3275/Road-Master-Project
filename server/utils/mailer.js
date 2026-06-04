const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendVerificationCode = async (email, code) => {
    await transporter.sendMail({
        from:    `"RoadMaster" <${process.env.GMAIL_USER}>`,
        to:      email,
        subject: 'קוד אימות - RoadMaster',
        html: `
            <div style="font-family: Arial; text-align: center; padding: 20px;">
                <h2>ברוך הבא ל־RoadMaster!</h2>
                <p>קוד האימות שלך הוא:</p>
                <h1 style="color: #2563eb; font-size: 40px; letter-spacing: 8px;">
                    ${code}
                </h1>
                <p>הקוד תקף למשך <strong>דקה אחת</strong> בלבד.</p>
            </div>
        `,
    });
};

module.exports = { sendVerificationCode };