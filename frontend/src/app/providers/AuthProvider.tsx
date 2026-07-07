import type { ReactNode } from "react";
import { AuthContext, useCheckAuth} from '@features/auth'

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { isAuthenticated, login, logout } = useCheckAuth();

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};
