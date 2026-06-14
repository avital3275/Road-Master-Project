import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import StudentSidebar from '../../components/StudentSidebar';
import Loader from '../../components/Loader';
import lessonService from '../../services/lessonService';
import theoryService from '../../services/theoryService';
import notificationService from '../../services/notificationService';
import '../../styles/Dashboard.css';

const BASE_URL = 'http://localhost:5000';

const StudentDashboard = () => {
    const { user, token } = useAuth();

    const [lessons, setLessons] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsData, resultsData, notifData] = await Promise.all([
                    lessonService.getMyLessons(token),
                    theoryService.getHistory(token),
                    notificationService.getMyNotifications(token),
                ]);
                setLessons(Array.isArray(lessonsData) ? lessonsData : []);
                setTestResults(Array.isArray(resultsData) ? resultsData : []);
                setNotifications(Array.isArray(notifData) ? notifData : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleMarkRead = async (id) => {
        await notificationService.markAsRead(id, token);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const handleDeleteNotif = async (id) => {
        await notificationService.deleteNotification(id, token);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const completedLessons = lessons.filter(l => l.status === 'completed').length;
    const nextLesson = lessons.find(l =>
        l.status === 'scheduled' && new Date(l.lesson_date) > new Date()
    );
    const lastResult = testResults[0];
    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <StudentSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1>שלום, {user?.full_name}</h1>
                    <p>רישיון סוג {user?.license_type} — בוא נמשיך להתקדם!</p>
                </div>

                <div className="cards-grid">
                    <div className="card">
                        <div className="card-value">{completedLessons} / 28</div>
                        <div className="card-label">שיעורים הושלמו</div>
                    </div>
                    <div className="card">
                        <div className="card-value">
                            {nextLesson
                                ? new Date(nextLesson.lesson_date).toLocaleDateString('he-IL')
                                : '—'}
                        </div>
                        <div className="card-label">השיעור הבא</div>
                    </div>
                    <div className="card">
                        <div className="card-value">
                            {lastResult ? `${lastResult.score}/${lastResult.total}` : '—'}
                        </div>
                        <div className="card-label">ציון אחרון במבחן</div>
                    </div>
                    <div className="card">
                        <div className="card-value">{testResults.length}</div>
                        <div className="card-label">מבחנים שנעשו</div>
                    </div>
                </div>

                {notifications.length > 0 && (
                    <div className="section notifications-section">
                        <div className="notifications-header">
                            <h2 className="section-title">
                                עדכונים
                                {unreadCount > 0 && (
                                    <span className="notif-badge">{unreadCount}</span>
                                )}
                            </h2>
                            {unreadCount > 0 && (
                                <button className="btn-text" onClick={async () => {
                                    await notificationService.markAllAsRead(token);
                                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                                }}>
                                    סמן הכל כנקרא
                                </button>
                            )}
                        </div>
                        <div className="notifications-list">
                            {notifications.map(notif => (
                                <div key={notif.id} className={`notification-item ${!notif.is_read ? 'unread' : ''} type-${notif.type}`}>
                                    <div className="notif-content">
                                        <strong>{notif.title}</strong>
                                        <p>{notif.body}</p>
                                        <span className="notif-date">
                                            {new Date(notif.created_at).toLocaleDateString('he-IL')}
                                        </span>
                                        {notif.file_path && (
                                            <a
                                                href={`${BASE_URL}${notif.file_path}`}
                                                download
                                                className="btn btn-outline notif-download"
                                            >
                                                הורד דוח PDF
                                            </a>
                                        )}
                                    </div>
                                    <div className="notif-actions">
                                        {!notif.is_read && (
                                            <button className="btn-icon" onClick={() => handleMarkRead(notif.id)} title="סמן כנקרא">
                                                ✓
                                            </button>
                                        )}
                                        <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteNotif(notif.id)} title="מחק">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="section">
                    <h2 className="section-title">שיעורים קרובים</h2>
                    {lessons.filter(l => l.status === 'scheduled' && new Date(l.lesson_date) > new Date()).length === 0 ? (
                        <div className="empty-state">
                            <span>📅</span>
                            <p>אין שיעורים מתוכננים — <a href="/student/schedule">תאם שיעור עכשיו</a></p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>תאריך</th><th>שעה</th><th>מורה</th><th>סטטוס</th></tr>
                                </thead>
                                <tbody>
                                    {lessons
                                        .filter(l => l.status === 'scheduled' && new Date(l.lesson_date) > new Date())
                                        .map(lesson => (
                                            <tr key={lesson.id}>
                                                <td>{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</td>
                                                <td>{new Date(lesson.lesson_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>{lesson.teacher_name}</td>
                                                <td><span className="badge badge-primary">מתוכנן</span></td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2 className="section-title">היסטוריית מבחנים</h2>
                    {testResults.length === 0 ? (
                        <div className="empty-state">
                            <span>✏️</span>
                            <p>עדיין לא עשית מבחן — <a href="/student/exam">התחל עכשיו</a></p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>תאריך</th><th>ציון</th><th>תוצאה</th></tr>
                                </thead>
                                <tbody>
                                    {testResults.map(result => (
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
            </main>
        </div>
    );
};

export default StudentDashboard;