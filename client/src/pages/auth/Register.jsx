import { useState }          from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService           from '../../services/authService';
import './Auth.css';

const LICENSE_TYPES = [
    { value: 'A', label: 'A — אופנועים וקטנועים' },
    { value: 'B', label: 'B — רכב פרטי ומסחרי קל' },
    { value: 'C', label: 'C — רכב משא' },
    { value: 'D', label: 'D — היסעים' },
];

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        full_name:    '',
        email:        '',
        password:     '',
        role:         'student',
        license_type: 'B',
    });

    const [teacherLicenses, setTeacherLicenses] = useState([]);
    const [code,    setCode]    = useState('');
    const [error,   setError]   = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleTeacherLicense = (value) => {
        setTeacherLicenses(prev =>
            prev.includes(value)
                ? prev.filter(l => l !== value)
                : [...prev, value]
        );
        setError('');
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const license_type = formData.role === 'teacher'
            ? JSON.stringify(teacherLicenses)
            : formData.license_type;

        try {
            const data = await authService.sendCode({
                ...formData,
                license_type,
            });

            if (data.message.includes('נשלח')) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('שגיאת תקשורת עם השרת');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.verifyAndRegister(formData.email, code);

            if (data.userId) {
                navigate('/login', {
                    state: { message: 'נרשמת בהצלחה! התחבר עכשיו' }
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('שגיאת תקשורת עם השרת');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setCode('');
        setError('');
        setMessage('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* ✅ לוגו מעודכן */}
                <div className="auth-logo">
                    <img src="/logo.png" alt="RoadMaster" style={{
                        width:        '52px',
                        height:       '52px',
                        borderRadius: '50%',
                        objectFit:    'cover',
                    }} />
                    <h1 className="logo-text">RoadMaster</h1>
                </div>

                {/* שלב 1 */}
                {step === 1 && (
                    <div className="step-container">
                        <h2 className="auth-title">הרשמה</h2>
                        <p className="auth-subtitle">צור חשבון חדש</p>

                        <form onSubmit={handleSendCode} className="auth-form">

                            <div className="form-group">
                                <label>שם מלא</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="ישראל ישראלי"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>אימייל</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>סיסמא</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="עד 8 אותיות אנגליות"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>אני נרשם בתור</label>
                                <div className="role-buttons">
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'student' })}
                                    >
                                        🎓 תלמיד
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'teacher' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    >
                                        👨‍🏫 מורה
                                    </button>
                                </div>
                            </div>

                            {formData.role === 'student' && (
                                <div className="form-group">
                                    <label>סוג רישיון</label>
                                    <select
                                        name="license_type"
                                        value={formData.license_type}
                                        onChange={handleChange}
                                    >
                                        {LICENSE_TYPES.map(l => (
                                            <option key={l.value} value={l.value}>
                                                {l.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {formData.role === 'teacher' && (
                                <div className="form-group">
                                    <label>סוגי רישיון שאני מלמד</label>
                                    <div className="license-checkboxes">
                                        {LICENSE_TYPES.map(l => (
                                            <label key={l.value} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={teacherLicenses.includes(l.value)}
                                                    onChange={() => handleTeacherLicense(l.value)}
                                                />
                                                {l.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="error-message">⚠️ {error}</div>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? <span className="spinner" /> : 'שלח קוד אימות'}
                            </button>

                        </form>

                        <p className="auth-switch">
                            יש לך חשבון? <Link to="/login">התחבר כאן</Link>
                        </p>
                    </div>
                )}

                {/* שלב 2 */}
                {step === 2 && (
                    <div className="step-container">
                        <h2 className="auth-title">אימות אימייל</h2>
                        <p className="auth-subtitle">
                            שלחנו קוד אימות ל־<strong>{formData.email}</strong>
                        </p>

                        {message && (
                            <div className="success-message">✅ {message}</div>
                        )}

                        <form onSubmit={handleVerify} className="auth-form">

                            <div className="form-group">
                                <label>קוד אימות</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="הזן קוד בן 6 ספרות"
                                    maxLength={6}
                                    className="code-input"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="error-message">⚠️ {error}</div>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? <span className="spinner" /> : 'אמת והירשם'}
                            </button>

                            <button
                                type="button"
                                className="back-button"
                                onClick={handleBack}
                            >
                                ← חזור
                            </button>

                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Register;