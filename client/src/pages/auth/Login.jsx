import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(formData.email, formData.password);

            if (data.token) {
                login(data.user, data.token);
                data.user.role === 'teacher'
                    ? navigate('/teacher/dashboard')
                    : navigate('/student/dashboard');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('שגיאת תקשורת עם השרת');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-logo">
                    <img src="/logo.png" alt="RoadMaster" style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }} />
                    <h1 className="logo-text">RoadMaster</h1>
                </div>

                <h2 className="auth-title">התחברות</h2>
                <p className="auth-subtitle">ברוך הבא! הזן את הפרטים שלך</p>

                <form onSubmit={handleSubmit} className="auth-form">

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
                            placeholder="הזן סיסמא"
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
                        {loading ? <span className="spinner" /> : 'התחבר'}
                    </button>

                </form>

                <p className="auth-switch">
                    אין לך חשבון?{' '}
                    <Link to="/register">הירשם כאן</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;