import { Navigate } from "react-router";

export default function ProtectedRoute({
    children, requiredRole,
}) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user) {
        return (
            <Navigate to="/login" replace />
        );
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/resources" replace />;
    }

    return children;

}