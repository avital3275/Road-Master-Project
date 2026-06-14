import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import TeacherSidebar from '../../components/TeacherSidebar';
import Loader from '../../components/Loader';
import lessonService from '../../services/lessonService';
import theoryService from '../../services/theoryService';
import userService from '../../services/userService';
import pdfService from '../../services/pdfService';
import '../../styles/Dashboard.css';

const Students = () => {
    const { token } = useAuth();

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentLessons, setStudentLessons] = useState([]);
    const [studentResults, setStudentResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportSending, setReportSending] = useState(false);
    const [reportMessage, setReportMessage] = useState('');
    const [reportError, setReportError] = useState('');

    const [reportForm, setReportForm] = useState({
        lessons_count: '',
        general_notes: '',
        progress: '',
        future_goals: '',
        recommendations: '',
        signature: '',
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await userService.getMyStudents(token);
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStudents();
    }, [token]);

    const handleSelectStudent = async (student) => {
        setSelectedStudent(student);
        setShowReportForm(false);
        setReportMessage('');
        setReportError('');
        setLoadingDetails(true);
        try {
            const [lessonsData, resultsData] = await Promise.all([
                lessonService.getStudentLessons(student.id, token),
                theoryService.getStudentHistory(student.id, token),
            ]);
            setStudentLessons(Array.isArray(lessonsData) ? lessonsData : []);
            setStudentResults(Array.isArray(resultsData) ? resultsData : []);
        } catch (err) { console.error(err); }
        finally { setLoadingDetails(false); }
    };

    const handleSendReport = async (e) => {
        e.preventDefault();
        setReportSending(true);
        setReportMessage('');
        setReportError('');
        try {
            const data = await pdfService.sendReport(
                { ...reportForm, student_id: selectedStudent.id },
                token
            );
            if (data.file_url) {
                setReportMessage('הדוח נשלח בהצלחה לתלמיד!');
                setShowReportForm(false);
                setReportForm({ lessons_count: '', general_notes: '', progress: '', future_goals: '', recommendations: '', signature: '' });
            } else {
                setReportError(data.message);
            }
        } catch {
            setReportError('שגיאת תקשורת');
        } finally {
            setReportSending(false);
        }
    };

    const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const completedLessons = studentLessons.filter(l => l.status === 'completed').length;
    const passedExams = studentResults.filter(r => r.passed).length;

    return (
        <div className="page-container">
            <TeacherSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1>תלמידים</h1>
                    <p>מעקב והיסטוריה של כל התלמידים שלך</p>
                </div>

                <div className="students-layout">
                    <div className="students-list-panel">
                        <div className="section">
                            <h2 className="section-title">רשימת תלמידים ({students.length})</h2>
                            <input type="text" className="search-input" placeholder="חפש תלמיד..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                style={{ marginBottom: '16px' }} />
                            {loading ? <Loader /> : filteredStudents.length === 0 ? (
                                <div className="empty-state"><span>👥</span><p>לא נמצאו תלמידים</p></div>
                            ) : (
                                <div className="students-list">
                                    {filteredStudents.map(student => (
                                        <div key={student.id}
                                            className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                                            onClick={() => handleSelectStudent(student)}>
                                            <div className="student-avatar">{student.full_name.charAt(0)}</div>
                                            <div className="student-info">
                                                <div className="student-name">{student.full_name}</div>
                                                <div className="student-meta">רישיון {student.license_type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="student-details-panel">
                        {!selectedStudent ? (
                            <div className="section">
                                <div className="empty-state"><span>👆</span><p>בחר תלמיד מהרשימה</p></div>
                            </div>
                        ) : loadingDetails ? <Loader /> : (
                            <>
                                <div className="section student-profile-card">
                                    <div className="student-profile-header">
                                        <div className="student-avatar large">{selectedStudent.full_name.charAt(0)}</div>
                                        <div>
                                            <h2>{selectedStudent.full_name}</h2>
                                            <p>{selectedStudent.email}</p>
                                            {selectedStudent.phone && <p>{selectedStudent.phone}</p>}
                                            <span className="badge badge-primary">רישיון {selectedStudent.license_type}</span>
                                        </div>
                                    </div>
                                    <div className="student-stats">
                                        <div className="stat-item">
                                            <strong>{completedLessons} / 28</strong>
                                            <span>שיעורים הושלמו</span>
                                        </div>
                                        <div className="stat-item">
                                            <strong>{studentResults.length}</strong>
                                            <span>מבחנים נעשו</span>
                                        </div>
                                        <div className="stat-item">
                                            <strong>{passedExams}</strong>
                                            <span>מבחנים עברו</span>
                                        </div>
                                    </div>

                                    {/* כפתור דוח */}
                                    <button className="btn btn-primary"
                                        style={{ marginTop: '16px' }}
                                        onClick={() => setShowReportForm(!showReportForm)}>
                                        {showReportForm ? 'סגור טופס' : 'שלח דוח התקדמות'}
                                    </button>

                                    {reportMessage && <div className="alert alert-success" style={{ marginTop: '12px' }}>{reportMessage}</div>}
                                    {reportError && <div className="alert alert-error" style={{ marginTop: '12px' }}>{reportError}</div>}
                                </div>

                                {/* טופס דוח */}
                                {showReportForm && (
                                    <div className="section">
                                        <h2 className="section-title">דוח התקדמות — {selectedStudent.full_name}</h2>
                                        <form onSubmit={handleSendReport} className="report-form">
                                            {[
                                                { key: 'lessons_count', label: 'מספר שיעורים', type: 'number', placeholder: 'כמה שיעורים נלמדו' },
                                                { key: 'general_notes', label: 'הערות כלליות', type: 'textarea', placeholder: 'הערות על הביצועים הכלליים...' },
                                                { key: 'progress', label: 'התקדמות עד כה', type: 'textarea', placeholder: 'תאר את ההתקדמות...' },
                                                { key: 'future_goals', label: 'מטרות עתידיות', type: 'textarea', placeholder: 'מה צריך לשפר...' },
                                                { key: 'recommendations', label: 'המלצות', type: 'textarea', placeholder: 'המלצות להמשך...' },
                                                { key: 'signature', label: 'חתימה', type: 'text', placeholder: 'שם המורה' },
                                            ].map(field => (
                                                <div key={field.key} className="form-group">
                                                    <label>{field.label}</label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea className="textarea-input" rows={3}
                                                            placeholder={field.placeholder}
                                                            value={reportForm[field.key]}
                                                            onChange={e => setReportForm({ ...reportForm, [field.key]: e.target.value })} />
                                                    ) : (
                                                        <input type={field.type} className="select-input"
                                                            placeholder={field.placeholder}
                                                            value={reportForm[field.key]}
                                                            onChange={e => setReportForm({ ...reportForm, [field.key]: e.target.value })} />
                                                    )}
                                                </div>
                                            ))}
                                            <button type="submit" className="btn btn-primary" disabled={reportSending}>
                                                {reportSending ? 'שולח...' : 'שלח דוח'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                <div className="section">
                                    <h2 className="section-title">היסטוריית שיעורים</h2>
                                    {studentLessons.length === 0 ? (
                                        <div className="empty-state"><span>📋</span><p>אין שיעורים עדיין</p></div>
                                    ) : (
                                        <div className="table-container">
                                            <table>
                                                <thead><tr><th>תאריך</th><th>סטטוס</th><th>הערות</th></tr></thead>
                                                <tbody>
                                                    {studentLessons.map(lesson => (
                                                        <tr key={lesson.id}>
                                                            <td>{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</td>
                                                            <td>
                                                                <span className={`badge ${lesson.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                                                                    {lesson.status === 'completed' ? 'הושלם' : 'מתוכנן'}
                                                                </span>
                                                            </td>
                                                            <td>{lesson.notes || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="section">
                                    <h2 className="section-title">היסטוריית מבחנים</h2>
                                    {studentResults.length === 0 ? (
                                        <div className="empty-state"><span>✏️</span><p>התלמיד עדיין לא עשה מבחן</p></div>
                                    ) : (
                                        <div className="table-container">
                                            <table>
                                                <thead><tr><th>תאריך</th><th>ציון</th><th>תוצאה</th></tr></thead>
                                                <tbody>
                                                    {studentResults.map(result => (
                                                        <tr key={result.id}>
                                                            <td>{new Date(result.taken_at).toLocaleDateString('he-IL')}</td>
                                                            <td>{result.score}/{result.total}</td>
                                                            <td>
                                                                <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>
                                                                    {result.passed ? 'עבר' : 'נכשל'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Students;