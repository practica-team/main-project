import { useAuth } from '@features/auth';
import { connectSocket, disconnectSocket, storage } from '@shared';
import React, { useEffect } from 'react';

export const SocketProvider = ({ children }: { children: React.ReactNode}) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if(isAuthenticated) {
            const token = storage.getToken();
            if(token) {
                connectSocket(token);
            }
        } else {
            disconnectSocket();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleLogout = () => disconnectSocket();
        window.addEventListener('auth:logout', handleLogout);
        return () => {
            window.removeEventListener('auth:logout', handleLogout);
            disconnectSocket();
        };
    }, []);

    return <>{children}</>;
};