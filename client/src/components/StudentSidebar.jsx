import { NavLink, useNavigate } from 'react-router-dom';
import useAuth                  from '../hooks/useAuth';

const StudentSidebar = () => {
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
                <NavLink to="/student/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span> לוח בקרה
                </NavLink>
                <NavLink to="/student/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📅</span> תיאום שיעורים
                </NavLink>
                <NavLink to="/student/theory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📚</span> תיאוריה
                </NavLink>
                <NavLink to="/student/exam" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">✏️</span> מבחן סימולציה
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

export default StudentSidebar;