import { NavLink, useNavigate } from 'react-router-dom';
import useAuth                  from '../hooks/useAuth';

const TeacherSidebar = () => {
    const { logout } = useAuth();
    const navigate   = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/logo.png" alt="RoadMaster" style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%', objectFit: 'cover'
                }} />
                <h2>RoadMaster</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/teacher/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span> לוח בקרה
                </NavLink>
                <NavLink to="/teacher/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📅</span> יומן שיעורים
                </NavLink>
                <NavLink to="/teacher/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">👥</span> תלמידים
                </NavLink>
                <NavLink to="/teacher/content" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📝</span> ניהול תוכן
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    🚪 התנתק
                </button>
            </div>
        </aside>
    );
};

export default TeacherSidebar;