import { useState, useEffect } from 'react';
import { NavLink }             from 'react-router-dom';
import useAuth                  from '../../hooks/useAuth';
import TeacherSidebar           from '../../components/TeacherSidebar';
import Loader                   from '../../components/Loader';
import lessonService            from '../../services/lessonService';
import userService              from '../../services/userService';
import '../../styles/Dashboard.css';

const TeacherDashboard = () => {
    const { user, token } = useAuth();

    const [lessons,  setLessons]  = useState([]);
    const [students, setStudents] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsData, studentsData] = await Promise.all([
                    lessonService.getMyLessons(token),
                    userService.getMyStudents(token),
                ]);
                setLessons(Array.isArray(lessonsData)   ? lessonsData  : []);
                setStudents(Array.isArray(studentsData) ? studentsData : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [token]);

    const todayLessons     = lessons.filter(l => {
        const today = new Date().toDateString();
        return new Date(l.lesson_date).toDateString() === today;
    });
    const scheduledLessons = lessons.filter(l => l.status === 'scheduled');
    const completedLessons = lessons.filter(l => l.status === 'completed');

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <TeacherSidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>שלום, {user?.full_name} 👋</h1>
                    <p>מורה נהיגה — ברוך הבא למערכת הניהול</p>
                </div>

                <div className="cards-grid">
                    <div className="card">
                        <div className="card-icon">👥</div>
                        <div className="card-value">{students.length}</div>
                        <div className="card-label">תלמידים פעילים</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">📅</div>
                        <div className="card-value">{todayLessons.length}</div>
                        <div className="card-label">שיעורים היום</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">⏳</div>
                        <div className="card-value">{scheduledLessons.length}</div>
                        <div className="card-label">שיעורים מתוכננים</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">✅</div>
                        <div className="card-value">{completedLessons.length}</div>
                        <div className="card-label">שיעורים הושלמו</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">📅 שיעורים היום</h2>
                    {todayLessons.length === 0 ? (
                        <div className="empty-state">
                            <span>☀️</span>
                            <p>אין שיעורים מתוכננים להיום</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>שעה</th><th>תלמיד</th><th>סטטוס</th></tr>
                                </thead>
                                <tbody>
                                    {todayLessons.map(lesson => (
                                        <tr key={lesson.id}>
                                            <td>{new Date(lesson.lesson_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{lesson.student_name}</td>
                                            <td>
                                                <span className={`badge ${
                                                    lesson.status === 'completed' ? 'badge-success' :
                                                    lesson.status === 'cancelled' ? 'badge-danger'  :
                                                    'badge-primary'
                                                }`}>
                                                    {lesson.status === 'completed' ? '✅ הושלם' :
                                                     lesson.status === 'cancelled' ? '❌ בוטל'  :
                                                     '⏳ מתוכנן'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2 className="section-title">🗓️ שיעורים קרובים</h2>
                    {scheduledLessons.length === 0 ? (
                        <div className="empty-state">
                            <span>📋</span>
                            <p>אין שיעורים מתוכננים</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>תאריך</th><th>שעה</th><th>תלמיד</th><th>פעולות</th></tr>
                                </thead>
                                <tbody>
                                    {scheduledLessons.slice(0, 5).map(lesson => (
                                        <tr key={lesson.id}>
                                            <td>{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</td>
                                            <td>{new Date(lesson.lesson_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{lesson.student_name}</td>
                                            <td>
                                                <NavLink
                                                    to="/teacher/calendar"
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 12px', fontSize: '13px' }}
                                                >
                                                    עדכן
                                                </NavLink>
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

export default TeacherDashboard;