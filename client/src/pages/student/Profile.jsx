import { useState, useEffect } from 'react';
import useAuth                 from '../../hooks/useAuth';
import StudentSidebar          from '../../components/StudentSidebar';
import Loader                  from '../../components/Loader';
import userService             from '../../services/userService';
import '../../styles/Dashboard.css';

const StudentProfile = () => {
    const { token, login } = useAuth();

    const [profile, setProfile] = useState(null);
    const [phone,   setPhone]   = useState('');
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [message, setMessage] = useState('');
    const [error,   setError]   = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile(token);
                setProfile(data);
                setPhone(data.phone || '');
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
            const data = await userService.updateProfile({ phone }, token);
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
            <StudentSidebar />
            <main className="main-content">

                {/* Hero header */}
                <div className="profile-page-header">
                    <div className="profile-avatar-large">
                        {profile?.full_name?.charAt(0)}
                    </div>
                    <div className="profile-header-info">
                        <h1 className="profile-name">{profile?.full_name}</h1>
                        <p className="profile-email">{profile?.email}</p>
                        <div className="profile-badges">
                            <span className="profile-badge">תלמיד</span>
                            <span className="profile-badge">רישיון {profile?.license_type}</span>
                            {profile?.region && <span className="profile-badge">{profile.region}</span>}
                        </div>
                    </div>
                </div>

                {/* Edit form */}
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
                                <label>סוג רישיון</label>
                                <div className="profile-readonly">{profile?.license_type}</div>
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

export default StudentProfile;