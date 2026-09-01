import { type IConversation, type IMessage } from "@entities/message";
import { getSocket } from "@shared";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { messageKeys } from "./keys";
import { appendToLastPage } from "./cache";
import type { ITypingPayload } from "@entities/message/model/types";

export const useSocketSubscription = (activeConversationId?: string) => {
    const queryClient = useQueryClient();
    const [ typing, setTyping ] = useState<Record<string, string[]>>({});

    const activeRef = useRef(activeConversationId);
    useEffect(() => {
        activeRef.current = activeConversationId;
    }, [activeConversationId]);

    useEffect(() => {
        const socket = getSocket();
        const onNewMessage = (payload?: unknown) => {
            const msg = payload as IMessage;

            queryClient.setQueryData<InfiniteData<IMessage[], number>>(messageKeys.messages(msg.conversationId), (old) => 
                appendToLastPage(old, msg)
            );

            queryClient.setQueryData<IConversation[]>(messageKeys.conversations, (old) =>
                old?.map((c) =>
                    c.id === msg.conversationId ? {
                        ...c,
                        lastMessage: msg,
                        unreadCount: activeRef.current === c.id ? 0 : (c.unreadCount ?? 0) + 1,
                    } : c
                )
            );
        };

        const onTyping = (payload?: unknown) => {
            const { conversationId, userId, isTyping } = payload as ITypingPayload;

            setTyping((prev) => {
                const current = prev[conversationId] ?? [];
                const next = isTyping === false ? (
                    current.filter((id) => id !== userId)
                ) : (current.includes(userId) ? ( current ) : ( [...current, userId] ) );
                return { ...prev, [conversationId]: next };
            });

            if(isTyping !== false){
                setTimeout(() => {
                    setTyping((prev) => ({
                        ...prev,
                        [conversationId]: (prev[conversationId] ?? []).filter(
                            (id) => id !== userId
                        ),
                    }));
                }, 1500);
            }
        };

        const onConversationUpdated = (payload?: unknown) => {
            const conv = payload as IConversation;
            queryClient.setQueryData<IConversation[]>(messageKeys.conversations, (old) => 
                old?.map((c) => (c.id === conv.id) ? {
                    ...conv, unreadCount: activeRef.current === conv.id ? 0 : conv.unreadCount 
                } : c )
            );
        };

        socket.on('message:new', onNewMessage);
        socket.on('typing', onTyping);
        socket.on('conversation:updated', onConversationUpdated);

        return () => {
            socket.off('message:new', onNewMessage);
            socket.off('typing', onTyping);
            socket.off('conversation:updated', onConversationUpdated);
        };
    }, [queryClient]);

    return { typing };
};