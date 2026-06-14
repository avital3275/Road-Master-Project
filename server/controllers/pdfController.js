const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const userModel = require('../models/userModel');
const notificationModel = require('../models/notificationModel');
const { sendReportEmail } = require('../utils/mailer');

const pdfController = {

  sendReport: async (req, res) => {
    const {
      student_id,
      lessons_count,
      general_notes,
      progress,
      future_goals,
      recommendations,
      signature,
    } = req.body;

    const teacher_id = req.user.id;

    try {
      const [teacher, student] = await Promise.all([
        userModel.findById(teacher_id),
        userModel.findById(student_id),
      ]);

      if (!student) return res.status(404).json({ message: 'תלמיד לא נמצא' });

      const reportsDir = path.join(__dirname, '..', 'uploads', 'reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

      const fileName = `report_${student_id}_${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      const fileUrl = `/uploads/reports/${fileName}`;

      const date = new Date().toLocaleDateString('he-IL');

      const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Heebo', Arial, sans-serif;
    direction: rtl;
    background: white;
    color: #2D3748;
    padding: 0;
  }

  .header {
    background: linear-gradient(135deg, #2D3748 0%, #3D4A5C 100%);
    padding: 36px 48px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-brand h1 {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .header-brand p {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
  }

  .header-date {
    text-align: left;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
  }

  .green-bar {
    height: 5px;
    background: linear-gradient(90deg, #7BA05B, #5F7A45);
  }

  .body {
    padding: 36px 48px;
  }

  .info-row {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    background: #F5EDE3;
    border-radius: 12px;
    padding: 20px 24px;
  }

  .info-item {
    flex: 1;
  }

  .info-label {
    font-size: 11px;
    font-weight: 700;
    color: #A89585;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 16px;
    font-weight: 700;
    color: #2D3748;
  }

  .section {
    margin-bottom: 24px;
    border: 1px solid #EAD9C8;
    border-radius: 12px;
    overflow: hidden;
  }

  .section-header {
    background: #F5EDE3;
    padding: 12px 20px;
    border-bottom: 1px solid #EAD9C8;
  }

  .section-header h3 {
    font-size: 14px;
    font-weight: 700;
    color: #5F7A45;
    letter-spacing: 0.3px;
  }

  .section-body {
    padding: 16px 20px;
    font-size: 14px;
    line-height: 1.8;
    color: #4A5568;
    min-height: 60px;
  }

  .signature-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 2px solid #EAD9C8;
  }

  .signature-box {
    text-align: center;
    min-width: 200px;
  }

  .signature-name {
    font-size: 15px;
    font-weight: 700;
    color: #2D3748;
    margin-bottom: 6px;
  }

  .signature-line {
    border-bottom: 2px solid #2D3748;
    margin-bottom: 6px;
    height: 24px;
  }

  .signature-label {
    font-size: 11px;
    color: #A89585;
    font-weight: 600;
  }

  .footer {
    margin-top: 40px;
    padding: 16px 48px;
    background: #F5EDE3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #A89585;
  }
</style>
</head>
<body>

  <div class="header">
    <div class="header-brand">
      <h1>RoadMaster</h1>
      <p>דוח התקדמות תלמיד</p>
    </div>
    <div class="header-date">
      <div>תאריך: ${date}</div>
    </div>
  </div>

  <div class="green-bar"></div>

  <div class="body">

    <div class="info-row">
      <div class="info-item">
        <div class="info-label">תלמיד</div>
        <div class="info-value">${student.full_name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">מורה</div>
        <div class="info-value">${teacher.full_name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">מספר שיעורים</div>
        <div class="info-value">${lessons_count}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><h3>הערות כלליות</h3></div>
      <div class="section-body">${general_notes || '—'}</div>
    </div>

    <div class="section">
      <div class="section-header"><h3>התקדמות עד כה</h3></div>
      <div class="section-body">${progress || '—'}</div>
    </div>

    <div class="section">
      <div class="section-header"><h3>מטרות עתידיות</h3></div>
      <div class="section-body">${future_goals || '—'}</div>
    </div>

    <div class="section">
      <div class="section-header"><h3>המלצות</h3></div>
      <div class="section-body">${recommendations || '—'}</div>
    </div>

    <div class="signature-row">
      <div class="signature-box">
        <div class="signature-name">${signature || teacher.full_name}</div>
        <div class="signature-line"></div>
        <div class="signature-label">חתימת המורה</div>
      </div>
    </div>

  </div>

  <div class="footer">
    <span>RoadMaster — מערכת ניהול בית ספר לנהיגה</span>
    <span>${date}</span>
  </div>

</body>
</html>`;

      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
      });
      await browser.close();

      await notificationModel.create(
        student_id,
        'דוח התקדמות חדש',
        `המורה ${teacher.full_name} שלח לך דוח התקדמות.`,
        'report',
        fileUrl
      );

      res.status(201).json({ message: 'הדוח נשלח בהצלחה!', file_url: fileUrl });

      sendReportEmail(student.email, student.full_name, teacher.full_name, filePath)
        .catch(err => console.error('שגיאת מייל:', err.message));
    } catch (err) {
      res.status(500).json({ message: 'שגיאת שרת', error: err.message });
    }
  },
};

module.exports = pdfController;