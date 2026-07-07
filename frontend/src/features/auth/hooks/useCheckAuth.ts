import { useState } from "react";
import { storage } from '@shared';

export const useCheckAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!storage.getToken();
    });


    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    return { isAuthenticated, login, logout };
}