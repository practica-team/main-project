import { $api } from "@shared";
import type { IConversation, IMessage } from "../model/types";

export const messageApi = {
    getConversations: () => $api.get<IConversation[]>(`/conversations`),

    getOrCreateConversation: (userId: string) => 
        $api.post<IConversation>(`/conversations`, { userId }),

    getMessages: (conversationId: string, page = 1, limit = 30) =>
        $api.get<IMessage[]>(`/conversations/${conversationId}/messages`, {
            params: { page, limit },
        }),
    
    sendMessage: (conversationId: string, content: string) =>
        $api.post<IMessage>(`/conversations/${conversationId}/messages`, { content }),

    markRead: (conversationId: string) =>
        $api.post(`conversations/${conversationId}/read`),
};