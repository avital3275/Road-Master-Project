import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const TeacherSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    const navItems = [
        { to: '/teacher/profile', label: 'הפרופיל שלי' },
        { to: '/teacher/dashboard', label: 'לוח בקרה' },
        { to: '/teacher/calendar', label: 'יומן שיעורים' },
        { to: '/teacher/students', label: 'תלמידים' },
        { to: '/teacher/content', label: 'ניהול תוכן' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/logo.png" alt="RoadMaster" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <h2>RoadMaster</h2>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink key={item.to} to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    התנתק
                </button>
            </div>
        </aside>
    );
};

export default TeacherSidebar;