import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import StudentSidebar from '../../components/StudentSidebar';
import Loader from '../../components/Loader';
import lessonService from '../../services/lessonService';
import userService from '../../services/userService';
import '../../styles/Dashboard.css';

const REGIONS = ['', 'מרכז', 'צפון', 'דרום', 'ירושלים'];

const Schedule = () => {
    const { token } = useAuth();

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [slots, setSlots] = useState([]);
    const [myLessons, setMyLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [regionFilter, setRegionFilter] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [teachersData, lessonsData] = await Promise.all([
                    userService.getTeachers(token, regionFilter),
                    lessonService.getMyLessons(token),
                ]);
                setTeachers(Array.isArray(teachersData) ? teachersData : []);
                setMyLessons(Array.isArray(lessonsData) ? lessonsData : []);
            } catch (err) { console.error(err); }
        };
        fetchInitialData();
    }, [token, regionFilter]);

    const fetchSlots = async (teacherId) => {
        setLoading(true);
        try {
            const data = await lessonService.getSlots(teacherId, token);
            setSlots(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleTeacherChange = (e) => {
        const id = e.target.value;
        setSelectedTeacher(id);
        if (id) fetchSlots(id);
        else setSlots([]);
    };

    const handleBook = async (slot) => {
        setError('');
        setMessage('');
        try {
            const data = await lessonService.bookLesson(selectedTeacher, slot.slot_date, token);
            if (data.lessonId) {
                setMessage('✅ השיעור תואם בהצלחה!');
                fetchSlots(selectedTeacher);
                const updated = await lessonService.getMyLessons(token);
                setMyLessons(Array.isArray(updated) ? updated : []);
            } else {
                setError(data.message);
            }
        } catch {
            setError('שגיאת תקשורת עם השרת');
        }
    };

    const upcomingLessons = myLessons.filter(l =>
        l.status === 'scheduled' && new Date(l.lesson_date) > new Date()
    );

    return (
        <div className="page-container">
            <StudentSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1>תיאום שיעורים</h1>
                    <p>בחר מורה וצפה בשעות הפנויות שלו</p>
                </div>

                <div className="section">
                    <h2 className="section-title">סינון וחיפוש מורה</h2>
                    <div className="filter-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>סינון לפי אזור</label>
                            <select
                                className="select-input"
                                value={regionFilter}
                                onChange={(e) => { setRegionFilter(e.target.value); setSelectedTeacher(''); setSlots([]); }}
                            >
                                <option value="">כל האזורים</option>
                                {REGIONS.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>בחר מורה</label>
                            <select className="select-input" value={selectedTeacher} onChange={handleTeacherChange}>
                                <option value="">— בחר מורה —</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.full_name} — {t.region || 'לא צוין'} — רישיון {t.license_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {selectedTeacher && (
                    <div className="section">
                        <h2 className="section-title">שעות פנויות</h2>
                        {loading ? <Loader /> : slots.length === 0 ? (
                            <div className="empty-state">
                                <span>📅</span>
                                <p>אין שעות פנויות למורה זה כרגע</p>
                            </div>
                        ) : (
                            <div className="slots-grid">
                                {slots.map(slot => (
                                    <div key={slot.id} className="slot-card">
                                        <div className="slot-date">
                                            {new Date(slot.slot_date).toLocaleDateString('he-IL', {
                                                weekday: 'long', day: 'numeric', month: 'long',
                                            })}
                                        </div>
                                        <div className="slot-time">
                                            {new Date(slot.slot_date).toLocaleTimeString('he-IL', {
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </div>
                                        <button className="btn btn-primary" onClick={() => handleBook(slot)}>
                                            הזמן שיעור
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="section">
                    <h2 className="section-title">השיעורים הקרובים שלי</h2>
                    {upcomingLessons.length === 0 ? (
                        <div className="empty-state">
                            <span>📋</span>
                            <p>אין שיעורים מתוכננים קרובים</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>תאריך</th><th>שעה</th><th>מורה</th><th>סטטוס</th></tr>
                                </thead>
                                <tbody>
                                    {upcomingLessons.map(lesson => (
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
            </main>
        </div>
    );
};

export default Schedule;