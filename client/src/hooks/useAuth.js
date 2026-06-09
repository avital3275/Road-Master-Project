import { useContext } from 'react';
import AuthContext    from '../context/AuthContext';

// Hook נוח לשימוש ב־AuthContext
const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth חייב להיות בתוך AuthProvider');
    }

    return context;
};

export default useAuth;