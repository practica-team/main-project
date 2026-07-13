import { useEffect, useState } from "react";
import { storage } from '@shared';

export const useCheckAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!storage.getToken();
    });


    const login = (token: string) => {
        storage.setToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        storage.removeToken();
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const handleGlobalLogout = () => {
            logout();
        };

        window.addEventListener('auth:logout', handleGlobalLogout);

        return () => {
            window.removeEventListener('auth:logout', handleGlobalLogout);
        };
    });

    return { isAuthenticated, login, logout };
};