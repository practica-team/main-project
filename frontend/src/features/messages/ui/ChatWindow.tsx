import type { IConversation } from "@entities/message";
import { useMessagesQuery, useSendMessageMutation } from "../model/useMessages";
import { useEffect, useRef } from "react";
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface IChatWindowProps {
    conversation: IConversation;
    typingUserId: string[];
}

export const ChatWindow = ({ conversation, typingUserId}: IChatWindowProps) => {
    const partner = conversation.participants[0];

    const {
        data: messages,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMessagesQuery(conversation.id);

    const sendMessage = useSendMessageMutation(conversation.id);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages?.length, typingUserId.length]);

    const isTyping = typingUserId.length > 0;

    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{ 
                px: 2, 
                py: 1.5, 
                borderBottom: '1px solid', 
                borderColor: 'divider'}}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {partner?.username ?? 'Диалог'}
                </Typography>
                <Typography variant="caption" color={isTyping ? 'primary.main' : 'text.secondary'}>
                    {isTyping ? 'печатает...' : 'в сети'}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {hasNextPage && (
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Button
                            size="small"
                            disabled={isFetchingNextPage}
                            onClick={() => fetchNextPage}
                            sx={{ textTransform: 'none' }}
                        >
                            {isFetchingNextPage ? 'Загрузка...' : 'Показать более ранние'}
                        </Button>
                    </Box>
                )}

                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {isError && (
                    <Typography variant="body2" color="error">
                        Не удалось загрузить сообщения.
                    </Typography>
                )}

                {messages?.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                ))}

                <div ref={bottomRef} />
            </Box>

            <MessageInput
                disabled={sendMessage.isPending}
                onSend={(content) => sendMessage.mutate(content)}
            />
        </Box>
    );
};