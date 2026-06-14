import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate }                               from 'react-router-dom';
import useAuth                                       from '../../hooks/useAuth';
import StudentSidebar                                from '../../components/StudentSidebar';
import Loader                                        from '../../components/Loader';
import theoryService                                 from '../../services/theoryService';
import '../../styles/Dashboard.css';

const EXAM_DURATION = 45 * 60;

const Exam = () => {
    const { token }  = useAuth();
    const navigate   = useNavigate();

    const [phase,     setPhase]     = useState('idle');
    const [questions, setQuestions] = useState([]);
    const [current,   setCurrent]   = useState(0);
    const [answers,   setAnswers]   = useState({});
    const [timeLeft,  setTimeLeft]  = useState(EXAM_DURATION);
    const [result,    setResult]    = useState(null);
    const [loading,   setLoading]   = useState(false);

    const seenIds = useRef(new Set());

    useEffect(() => {
        if (phase !== 'exam') return;
        if (timeLeft <= 0) { handleSubmit(); return; }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [phase, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleStart = async () => {
        setLoading(true);
        try {
            const data = await theoryService.getExam(token);
            const filtered = data.filter(q => !seenIds.current.has(q.id));
            const toUse    = filtered.length >= 30 ? filtered : data;
            toUse.forEach(q => seenIds.current.add(q.id));
            setQuestions(toUse);
            setAnswers({});
            setCurrent(0);
            setTimeLeft(EXAM_DURATION);
            setPhase('exam');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = useCallback(async () => {
        const score = questions.reduce((acc, q) =>
            answers[q.id] === q.correct_answer ? acc + 1 : acc, 0);
        try {
            const data = await theoryService.submitExam(score, questions.length, token);
            setResult(data);
            setPhase('result');
        } catch (err) { console.error(err); }
    }, [questions, answers, token]);

    return (
        <div className="page-container">
            <StudentSidebar />
            <main className="main-content">

                {phase === 'idle' && (
                    <>
                        <div className="page-header">
                            <h1>מבחן תיאוריה — סימולציה</h1>
                            <p>30 שאלות — 45 דקות — 26 נכונות להצלחה</p>
                        </div>
                        <div className="section exam-intro">
                            <div className="exam-info-grid">
                                <div className="exam-info-card">
                                    <span>❓</span><strong>30</strong><p>שאלות</p>
                                </div>
                                <div className="exam-info-card">
                                    <span>⏱️</span><strong>45</strong><p>דקות</p>
                                </div>
                                <div className="exam-info-card">
                                    <span>🏆</span><strong>26/30</strong><p>לעבור</p>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-large" onClick={handleStart} disabled={loading}>
                                {loading ? 'טוען שאלות...' : 'התחל מבחן'}
                            </button>
                        </div>
                    </>
                )}

                {phase === 'exam' && questions.length > 0 && (
                    <>
                        <div className="exam-header">
                            <div className="exam-progress-text">שאלה {current + 1} מתוך {questions.length}</div>
                            <div className={`exam-timer ${timeLeft < 300 ? 'danger' : ''}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill"
                                style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
                        </div>
                        <div className="section question-card">
                            {questions[current].image_path && (
                                <img src={`http://localhost:5000${questions[current].image_path}`}
                                    alt="תמרור" className="question-image" />
                            )}
                            <h2 className="question-text">{questions[current].question_text}</h2>
                            <div className="answers-grid">
                                {['a','b','c','d'].map(opt => (
                                    <button key={opt}
                                        className={`answer-btn ${answers[questions[current].id] === opt ? 'selected' : ''}`}
                                        onClick={() => handleAnswer(questions[current].id, opt)}>
                                        <span className="answer-letter">{opt.toUpperCase()}</span>
                                        {questions[current][`option_${opt}`]}
                                    </button>
                                ))}
                            </div>
                            <div className="exam-nav">
                                <button className="btn btn-outline"
                                    onClick={() => setCurrent(prev => prev - 1)}
                                    disabled={current === 0}>
                                    הקודם
                                </button>
                                {current < questions.length - 1 ? (
                                    <button className="btn btn-primary"
                                        onClick={() => setCurrent(prev => prev + 1)}>
                                        הבא
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleSubmit}>
                                        סיים מבחן
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {phase === 'result' && result && (
                    <div className="section result-card">
                        <div className="result-icon">{result.passed ? '🏆' : '😞'}</div>
                        <h2 className="result-title">
                            {result.passed ? 'כל הכבוד, עברת!' : 'לא עברת הפעם'}
                        </h2>
                        <div className="result-score">{result.score} / {result.total}</div>
                        <p className="result-percent">
                            {Math.round((result.score / result.total) * 100)}%
                        </p>
                        <div className="result-actions">
                            <button className="btn btn-primary" onClick={handleStart}>נסה שוב</button>
                            <button className="btn btn-outline"
                                onClick={() => navigate('/student/dashboard')}>
                                חזור לדשבורד
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Exam;