import { useState, useEffect }  from 'react';
import useAuth                   from '../../hooks/useAuth';
import StudentSidebar            from '../../components/StudentSidebar';
import Loader                    from '../../components/Loader';
import lessonService             from '../../services/lessonService';
import theoryService             from '../../services/theoryService';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
    const { user, token } = useAuth();

    const [lessons,     setLessons]     = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [loading,     setLoading]     = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsData, resultsData] = await Promise.all([
                    lessonService.getMyLessons(token),
                    theoryService.getHistory(token),
                ]);
                setLessons(Array.isArray(lessonsData)     ? lessonsData : []);
                setTestResults(Array.isArray(resultsData) ? resultsData : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const completedLessons = lessons.filter(l => l.status === 'completed').length;
    const nextLesson       = lessons.find(l => l.status === 'scheduled');
    const lastResult       = testResults[0];

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <StudentSidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>שלום, {user?.full_name} 👋</h1>
                    <p>רישיון סוג {user?.license_type} — בוא נמשיך להתקדם!</p>
                </div>

                <div className="cards-grid">
                    <div className="card">
                        <div className="card-icon">🚗</div>
                        <div className="card-value">{completedLessons} / 28</div>
                        <div className="card-label">שיעורי נהיגה הושלמו</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">📅</div>
                        <div className="card-value">
                            {nextLesson
                                ? new Date(nextLesson.lesson_date).toLocaleDateString('he-IL')
                                : '—'}
                        </div>
                        <div className="card-label">השיעור הבא</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">✏️</div>
                        <div className="card-value">
                            {lastResult ? `${lastResult.score}/${lastResult.total}` : '—'}
                        </div>
                        <div className="card-label">ציון אחרון במבחן</div>
                    </div>
                    <div className="card">
                        <div className="card-icon">🏆</div>
                        <div className="card-value">{testResults.length}</div>
                        <div className="card-label">מבחנים שנעשו</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">📅 שיעורים קרובים</h2>
                    {lessons.filter(l => l.status === 'scheduled').length === 0 ? (
                        <div className="empty-state">
                            <span>📅</span>
                            <p>אין שיעורים מתוכננים — <a href="/student/schedule">תאם שיעור עכשיו</a></p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>תאריך</th>
                                        <th>שעה</th>
                                        <th>מורה</th>
                                        <th>סטטוס</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lessons.filter(l => l.status === 'scheduled').map(lesson => (
                                        <tr key={lesson.id}>
                                            <td>{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</td>
                                            <td>{new Date(lesson.lesson_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{lesson.teacher_name}</td>
                                            <td><span className="badge badge-primary">⏳ מתוכנן</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2 className="section-title">📊 היסטוריית מבחנים</h2>
                    {testResults.length === 0 ? (
                        <div className="empty-state">
                            <span>✏️</span>
                            <p>עדיין לא עשית מבחן — <a href="/student/exam">התחל עכשיו</a></p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>תאריך</th>
                                        <th>ציון</th>
                                        <th>תוצאה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map(result => (
                                        <tr key={result.id}>
                                            <td>{new Date(result.taken_at).toLocaleDateString('he-IL')}</td>
                                            <td>{result.score}/{result.total}</td>
                                            <td>
                                                <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>
                                                    {result.passed ? '✅ עבר' : '❌ נכשל'}
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