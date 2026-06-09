import { Navigate } from 'react-router-dom';
import useAuth      from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;