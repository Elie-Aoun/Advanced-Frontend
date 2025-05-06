import { Navigate } from 'react-router-dom';

const RequireRole = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('role'); // adjust if you use Redux or Context

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/403" />; // You can create a simple 403 Forbidden page
    }

    return children;
};

export default RequireRole;
