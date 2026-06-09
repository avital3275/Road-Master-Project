import { useState, useEffect } from 'react';
import useAuth                  from '../../hooks/useAuth';
import TeacherSidebar           from '../../components/TeacherSidebar';
import Loader                   from '../../components/Loader';
import theoryService            from '../../services/theoryService';
import '../../styles/Dashboard.css';

const LICENSE_TYPES = ['A', 'B', 'C', 'D'];

const ContentManager = () => {
    const { token } = useAuth();

    const [questions,     setQuestions]     = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [filterLicense, setFilterLicense] = useState('');
    const [message,       setMessage]       = useState('');
    const [error,         setError]         = useState('');
    const [showForm,      setShowForm]      = useState(false);
    const [submitting,    setSubmitting]    = useState(false);
    const [imageFile,     setImageFile]     = useState(null);

    const [form, setForm] = useState({
        question_text:  '',
        option_a:       '',
        option_b:       '',
        option_c:       '',
        option_d:       '',
        correct_answer: 'a',
        license_type:   'B',
    });

    const fetchQuestions = async () => {
        try {
            const data = await theoryService.getQuestions(filterLicense, token);
            setQuestions(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchQuestions(); }, [token, filterLicense]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        if (imageFile) formData.append('image', imageFile);

        try {
            const data = await theoryService.addQuestion(formData, token);
            if (data.questionId) {
                setMessage('✅ השאלה נוספה בהצלחה!');
                setShowForm(false);
                setForm({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a', license_type: 'B' });
                setImageFile(null);
                fetchQuestions();
            } else {
                setError(data.message);
            }
        } catch (err) { setError('שגיאת תקשורת עם השרת'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('האם למחוק את השאלה?')) return;
        try {
            const data = await theoryService.deleteQuestion(id, token);
            if (data.message) {
                setMessage('✅ השאלה נמחקה!');
                setQuestions(prev => prev.filter(q => q.id !== id));
            }
        } catch (err) { setError('שגיאה במחיקה'); }
    };

    return (
        <div className="page-container">
            <TeacherSidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>📝 ניהול תוכן</h1>
                    <p>הוסף ונהל שאלות תיאוריה</p>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error   && <div className="alert alert-error">{error}</div>}

                <div className="section">
                    <div className="content-toolbar">
                        <div className="filter-group">
                            <label>סנן לפי רישיון:</label>
                            <select
                                className="select-input"
                                value={filterLicense}
                                onChange={(e) => setFilterLicense(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                <option value="">הכל</option>
                                {LICENSE_TYPES.map(l => (
                                    <option key={l} value={l}>רישיון {l}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? '✕ סגור' : '+ הוסף שאלה'}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="section">
                        <h2 className="section-title">הוספת שאלה חדשה</h2>
                        <form onSubmit={handleSubmit} className="question-form">
                            <div className="form-group">
                                <label>טקסט השאלה</label>
                                <textarea
                                    className="textarea-input"
                                    value={form.question_text}
                                    onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                                    placeholder="הזן את השאלה..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>סוג רישיון</label>
                                <select
                                    className="select-input"
                                    value={form.license_type}
                                    onChange={(e) => setForm({ ...form, license_type: e.target.value })}
                                >
                                    {LICENSE_TYPES.map(l => (
                                        <option key={l} value={l}>רישיון {l}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="options-grid">
                                {['a', 'b', 'c', 'd'].map(opt => (
                                    <div key={opt} className="form-group">
                                        <label>
                                            אפשרות {opt.toUpperCase()}
                                            {form.correct_answer === opt && <span className="correct-label"> ✅ נכונה</span>}
                                        </label>
                                        <div className="option-input-row">
                                            <input
                                                type="text"
                                                value={form[`option_${opt}`]}
                                                onChange={(e) => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                                                placeholder={`אפשרות ${opt.toUpperCase()}`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={`correct-btn ${form.correct_answer === opt ? 'active' : ''}`}
                                                onClick={() => setForm({ ...form, correct_answer: opt })}
                                            >✓</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="form-group">
                                <label>תמונת תמרור (אופציונלי)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="file-input"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? '⏳ שומר...' : '💾 שמור שאלה'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="section">
                    <h2 className="section-title">שאלות במאגר ({questions.length})</h2>
                    {loading ? <Loader /> : questions.length === 0 ? (
                        <div className="empty-state">
                            <span>📝</span><p>אין שאלות במאגר עדיין</p>
                        </div>
                    ) : (
                        <div className="questions-list">
                            {questions.map((q, index) => (
                                <div key={q.id} className="question-item">
                                    <div className="question-item-header">
                                        <span className="question-number">#{index + 1}</span>
                                        <span className="badge badge-primary">רישיון {q.license_type}</span>
                                        <button className="delete-btn" onClick={() => handleDelete(q.id)}>🗑️</button>
                                    </div>
                                    <div className="question-item-text">
                                        {q.image_path && (
                                            <img src={`http://localhost:5000${q.image_path}`} alt="תמרור" className="question-thumb" />
                                        )}
                                        <p>{q.question_text}</p>
                                    </div>
                                    <div className="question-options">
                                        {['a', 'b', 'c', 'd'].map(opt => (
                                            <span key={opt} className={`option-tag ${q.correct_answer === opt ? 'correct' : ''}`}>
                                                {opt.toUpperCase()}. {q[`option_${opt}`]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContentManager;