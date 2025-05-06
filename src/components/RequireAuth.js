import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token'); // or whatever you use for auth

    if (!token) {
        // Not logged in — redirect to login
        return <Navigate to="/login" />;
    }

    // Logged in — allow access
    return children;
};

export default RequireAuth;
