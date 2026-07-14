import type { ReactNode } from "react";
import { AuthContext, useCheckAuth} from '@features/auth';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const authData = useCheckAuth();

    return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};
