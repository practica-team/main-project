import { useAuth } from "@features/auth";
import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated, isLoading } = useAuth();

    if(isLoading){
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    bgcolor: '#edeef0'
                }}
            >
                <CircularProgress size={48} color="primary" />
            </Box>
        );
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};