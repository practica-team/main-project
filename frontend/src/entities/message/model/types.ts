import type { IUser } from "@entities/user";

export interface IMessage {
    id: string;
    conversationId: string;
    senderId: string;
    sender?: IUser;
    content: string;
    createdAt: string;
    readAt?: string;
}

export interface IConversation {
    id: string;
    participants: IUser[];
    lastMessage?: IMessage | null;
    unreadCount?: number;
    createdAt: string;
}

export interface ITypingPayload {
    conversationId: string;
    userId: string;
    isTyping?: boolean;
}