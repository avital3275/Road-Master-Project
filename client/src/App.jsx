import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth            from './hooks/useAuth';
import ProtectedRoute     from './components/ProtectedRoute';

import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import Schedule         from './pages/student/Schedule';
import Theory           from './pages/student/Theory';
import Exam             from './pages/student/Exam';

import TeacherDashboard from './pages/teacher/Dashboard';
import Students         from './pages/teacher/Students';
import Calendar         from './pages/teacher/Calendar';
import ContentManager   from './pages/teacher/ContentManager';

const HomeRedirect = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return user.role === 'teacher'
        ? <Navigate to="/teacher/dashboard" replace />
        : <Navigate to="/student/dashboard" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login"    element={<Login />}    />
                <Route path="/register" element={<Register />} />

                {/* תלמיד */}
                <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/schedule"  element={<ProtectedRoute allowedRole="student"><Schedule /></ProtectedRoute>} />
                <Route path="/student/theory"    element={<ProtectedRoute allowedRole="student"><Theory /></ProtectedRoute>} />
                <Route path="/student/exam"      element={<ProtectedRoute allowedRole="student"><Exam /></ProtectedRoute>} />

                {/* מורה */}
                <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/students"  element={<ProtectedRoute allowedRole="teacher"><Students /></ProtectedRoute>} />
                <Route path="/teacher/calendar"  element={<ProtectedRoute allowedRole="teacher"><Calendar /></ProtectedRoute>} />
                <Route path="/teacher/content"   element={<ProtectedRoute allowedRole="teacher"><ContentManager /></ProtectedRoute>} />

                <Route path="/"  element={<HomeRedirect />} />
                <Route path="*"  element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;