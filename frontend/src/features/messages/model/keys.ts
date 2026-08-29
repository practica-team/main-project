export const messageKeys = {
    conversations: ['conversations'] as const,
    messages: (conversationId: string) => ['messages', conversationId] as const,
};

export const MESSAGES_PAGE_SIZE = 30;