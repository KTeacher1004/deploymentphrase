import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, isTeacher, isStudent }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Checking authentication...</div>;
    }

    if (!user) {
        return <Navigate to="/home" replace />;
    }

    if (isTeacher && !user.isTeacher) {
        return <Navigate to="/" replace />;
    }

    if (isStudent && user.isTeacher) {
        return <Navigate to="/" replace />;
    }

    return children;
}
