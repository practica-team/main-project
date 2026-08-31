import type { IMessage } from "@entities/message";
import { useAuth } from "@features/auth";
import { getSocket } from "@shared";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageKeys } from "../model/keys";
import { getActiveConversationId } from "../model/useMessages";
import { Alert, Snackbar } from "@mui/material";

interface ToastState {
    id: string;
    title: string;
    text: string;
    conversationId: string;
}

export const MessagesToast = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [ toast, setToast ] = useState<ToastState | null>();

    useEffect(() => {
        const socket = getSocket();

        const onNewMessage = (payload?: unknown) => {
            const msg = payload as IMessage;

            queryClient.invalidateQueries({ queryKey: messageKeys.conversations });

            if(msg.senderId === user?.id){
                return;
            }
            if(msg.conversationId === getActiveConversationId()){
                return;
            }

            setToast({
                id: msg.id,
                title: msg.sender?.username ?? 'Новое сообщение',
                text: msg.content,
                conversationId: msg.conversationId,
            });
        };

        socket.on('message:new', onNewMessage);
        return () => {
            socket.off('message:new', onNewMessage);
        };
    }, [queryClient, user?.id]);

    const handleToastClick = () => {
        if(toast){
            navigate(`/messages?conversation=${toast.conversationId}`);
            setToast(null);
        }
    };

    return (
        <Snackbar
            open={toast !== null}
            autoHideDuration={5000}
            onClose={(_event, reason) => {
                if(reason !== 'clickaway'){
                    setToast(null);
                }
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
            sx={{ cursor: 'pointer' }}
            onClick={handleToastClick}
        >
            <Alert severity="info" variant="filled" onClose={() => setToast(null)} sx={{ maxWidth: 360 }}>
                <strong>{toast?.title}</strong>: {toast?.text}
            </Alert>
        </Snackbar>
    );
};