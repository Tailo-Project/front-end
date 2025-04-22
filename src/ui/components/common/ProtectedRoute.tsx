import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/shared/utils/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const PUBLIC_PATHS = ['/', '/login', '/signup'];

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const isPublicPath = PUBLIC_PATHS.includes(location.pathname);

    if (!isAuthenticated() && !isPublicPath) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
