import { useState, useEffect } from 'react';
import useAuth                 from '../../hooks/useAuth';
import TeacherSidebar          from '../../components/TeacherSidebar';
import Loader                  from '../../components/Loader';
import userService             from '../../services/userService';
import '../../styles/Dashboard.css';

const REGIONS = ['מרכז', 'צפון', 'דרום', 'ירושלים'];

const TeacherProfile = () => {
    const { token, login } = useAuth();

    const [profile, setProfile] = useState(null);
    const [phone,   setPhone]   = useState('');
    const [region,  setRegion]  = useState('');
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [message, setMessage] = useState('');
    const [error,   setError]   = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile(token);
                setProfile(data);
                setPhone(data.phone   || '');
                setRegion(data.region || '');
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const data = await userService.updateProfile({ phone, region }, token);
            if (data.user) {
                login(data.user, token);
                setMessage('הפרופיל עודכן בהצלחה!');
            } else {
                setError(data.message);
            }
        } catch { setError('שגיאת תקשורת'); }
        finally { setSaving(false); }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <TeacherSidebar />
            <main className="main-content">

                <div className="profile-page-header">
                    <div className="profile-avatar-large">
                        {profile?.full_name?.charAt(0)}
                    </div>
                    <div className="profile-header-info">
                        <h1 className="profile-name">{profile?.full_name}</h1>
                        <p className="profile-email">{profile?.email}</p>
                        <div className="profile-badges">
                            <span className="profile-badge">מורה.ת נהיגה</span>
                            {profile?.region && <span className="profile-badge">{profile.region}</span>}
                            {profile?.phone  && <span className="profile-badge">{profile.phone}</span>}
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">עדכון פרטים אישיים</h2>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error   && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSave}>
                        <div className="profile-form-grid">
                            <div className="form-group">
                                <label>שם מלא</label>
                                <div className="profile-readonly">{profile?.full_name}</div>
                            </div>
                            <div className="form-group">
                                <label>אימייל</label>
                                <div className="profile-readonly">{profile?.email}</div>
                            </div>
                            <div className="form-group">
                                <label>מספר טלפון</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="050-0000000"
                                    className="select-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>אזור פעילות</label>
                                <select
                                    value={region}
                                    onChange={e => setRegion(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">— בחר אזור —</option>
                                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="profile-save-row">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'שומר...' : 'שמור שינויים'}
                            </button>
                        </div>
                    </form>
                </div>

            </main>
        </div>
    );
};

export default TeacherProfile;