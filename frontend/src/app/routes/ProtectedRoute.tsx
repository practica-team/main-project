import { useAuth } from "@features/auth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};