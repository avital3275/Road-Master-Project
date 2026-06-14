import React                   from 'react';
import { useState, useEffect } from 'react';
import useAuth                  from '../../hooks/useAuth';
import TeacherSidebar           from '../../components/TeacherSidebar';
import Loader                   from '../../components/Loader';
import lessonService            from '../../services/lessonService';
import '../../styles/Dashboard.css';

const HOURS     = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
const DAY_NAMES = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

const getWeekDays = (weekOffset) => {
    const today  = new Date();
    const day    = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return d;
    });
};

const isSaturday = (date) => date.getDay() === 6;
const isPast     = (date, hour) => {
    const [h] = hour.split(':').map(Number);
    const cell = new Date(date);
    cell.setHours(h, 0, 0, 0);
    return cell <= new Date();
};

const Calendar = () => {
    const { token } = useAuth();

    const [lessons,        setLessons]        = useState([]);
    const [slots,          setSlots]          = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [updateForm,     setUpdateForm]     = useState({ status: '', notes: '' });
    const [message,        setMessage]        = useState('');
    const [error,          setError]          = useState('');
    const [loading,        setLoading]        = useState(true);
    const [weekOffset,     setWeekOffset]     = useState(0);

    const weekDays = getWeekDays(weekOffset);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsData, slotsData] = await Promise.all([
                    lessonService.getMyLessons(token),
                    lessonService.getMySlots(token),
                ]);
                setLessons(Array.isArray(lessonsData) ? lessonsData : []);
                setSlots(Array.isArray(slotsData)     ? slotsData   : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [token]);

    const handleAddSlot = async (day, hour) => {
        if (isSaturday(day) || isPast(day, hour)) return;
        const date = new Date(day);
        const [h]  = hour.split(':').map(Number);
        date.setHours(h, 0, 0, 0);
        const pad       = (n) => String(n).padStart(2, '0');
        const localDate = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:00:00`;
        try {
            const data = await lessonService.addSlot(localDate, token);
            if (data.id) {
                setSlots(prev => [...prev, data]);
                setMessage('שעה נוספה!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch { setError('שגיאה בהוספת שעה'); }
    };

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            const data = await lessonService.updateLesson(
                selectedLesson.id, updateForm.status, updateForm.notes, token
            );
            if (data.message) {
                setMessage('השיעור עודכן!');
                setTimeout(() => setMessage(''), 3000);
                if (updateForm.status === 'cancelled') {
                    setLessons(prev => prev.filter(l => l.id !== selectedLesson.id));
                } else {
                    setLessons(prev => prev.map(l =>
                        l.id === selectedLesson.id ? { ...l, ...updateForm } : l
                    ));
                }
                setSelectedLesson(null);
            }
        } catch { setError('שגיאת תקשורת'); }
    };

    const getLessonForCell = (day, hour) => lessons.find(l => {
        const d = new Date(l.lesson_date);
        return d.toDateString() === day.toDateString() &&
               d.getHours() === parseInt(hour);
    });

    const getSlotForCell = (day, hour) => slots.find(s => {
        const d = new Date(s.slot_date);
        return d.toDateString() === day.toDateString() &&
               d.getHours() === parseInt(hour);
    });

    return (
        <div className="page-container">
            <TeacherSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1>יומן שיעורים</h1>
                    <p>נהל את השעות הפנויות ועדכן שיעורים</p>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error   && <div className="alert alert-error">{error}</div>}

                <div className="section">
                    <div className="week-nav">
                        <button className="btn btn-outline" onClick={() => setWeekOffset(p => p - 1)}>→ שבוע קודם</button>
                        <span className="week-title">
                            {weekDays[0].toLocaleDateString('he-IL')} — {weekDays[6].toLocaleDateString('he-IL')}
                        </span>
                        <button className="btn btn-outline" onClick={() => setWeekOffset(p => p + 1)}>שבוע הבא ←</button>
                    </div>
                </div>

                <div className="calendar-legend">
                    <span className="legend-item"><span className="legend-dot dot-free" /> שעה פנויה</span>
                    <span className="legend-item"><span className="legend-dot dot-booked" /> שיעור מתוכנן</span>
                    <span className="legend-item"><span className="legend-dot dot-done" /> שיעור הושלם</span>
                    <span className="legend-item"><span className="legend-dot dot-closed" /> חסום</span>
                </div>

                {loading ? <Loader /> : (
                    <div className="section calendar-section">
                        <div className="calendar-grid" style={{ gridTemplateColumns: `80px repeat(7, 1fr)` }}>
                            <div className="calendar-corner" />
                            {weekDays.map((day, i) => (
                                <div key={i} className={`calendar-day-header ${isSaturday(day) ? 'day-shabbat' : ''}`}>
                                    <div className="day-name">{DAY_NAMES[i]}</div>
                                    <div className="day-date">
                                        {day.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })}
                                    </div>
                                </div>
                            ))}

                            {HOURS.map(hour => (
                                <React.Fragment key={hour}>
                                    <div className="calendar-hour-label">{hour}</div>
                                    {weekDays.map((day, di) => {
                                        const lesson  = getLessonForCell(day, hour);
                                        const slot    = getSlotForCell(day, hour);
                                        const shabbat = isSaturday(day);
                                        const past    = isPast(day, hour);

                                        let cellClass = 'calendar-cell';
                                        if (shabbat || past)                    cellClass += ' cell-closed';
                                        else if (lesson?.status === 'completed') cellClass += ' cell-done';
                                        else if (lesson)                         cellClass += ' cell-booked';
                                        else if (slot)                           cellClass += ' cell-available';
                                        else                                     cellClass += ' cell-empty';

                                        return (
                                            <div
                                                key={`${di}-${hour}`}
                                                className={cellClass}
                                                onClick={() => {
                                                    if (shabbat || past) return;
                                                    if (lesson && lesson.status !== 'completed') {
                                                        setSelectedLesson(lesson);
                                                        setUpdateForm({ status: lesson.status, notes: lesson.notes || '' });
                                                    } else if (!slot && !lesson) {
                                                        handleAddSlot(day, hour);
                                                    }
                                                }}
                                            >
                                                {lesson && (
                                                    <div className="cell-content">
                                                        <div className="cell-student">{lesson.student_name}</div>
                                                        <div className="cell-status">
                                                            {lesson.status === 'completed' ? '✓' : '⏳'}
                                                        </div>
                                                    </div>
                                                )}
                                                {slot && !lesson && <div className="cell-content cell-free-text">פנוי</div>}
                                                {!lesson && !slot && !shabbat && !past && <div className="cell-add">+</div>}
                                                {shabbat && <div className="cell-shabbat">שבת</div>}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {selectedLesson && (
                    <div className="modal-overlay" onClick={() => setSelectedLesson(null)}>
                        <div className="modal-card" onClick={e => e.stopPropagation()}>
                            <h2 className="section-title">עדכון שיעור</h2>
                            <p style={{ marginBottom: '16px', color: 'var(--gray-600)' }}>
                                תלמיד: <strong>{selectedLesson.student_name}</strong> |
                                תאריך: {new Date(selectedLesson.lesson_date).toLocaleString('he-IL')}
                            </p>
                            <form onSubmit={handleUpdateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group">
                                    <label>סטטוס שיעור</label>
                                    <select className="select-input" value={updateForm.status}
                                        onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                                        <option value="scheduled">מתוכנן</option>
                                        <option value="cancelled">בוטל</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>הערות</label>
                                    <textarea className="textarea-input" value={updateForm.notes} rows={3}
                                        onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                        placeholder="הוסף הערות על השיעור..." />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn btn-primary">שמור שינויים</button>
                                    <button type="button" className="btn btn-outline" onClick={() => setSelectedLesson(null)}>ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Calendar;