import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if(!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            transports: [ 'websocket', 'polling' ],
        });
    }
    return socket;
};

export const connectSocket = (token: string): Socket => {
    const soc = getSocket();
    soc.auth = { token };
    if(!soc.connected) {
        soc.connect();
    }
    return soc;
};

export const disconnectSocket = (): void => {
    if(socket && socket.connected) {
        socket.disconnect();
    }
};