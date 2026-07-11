import { useState } from "react";
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

    return { isAuthenticated, login, logout };
};