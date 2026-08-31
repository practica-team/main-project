import { ChatWindow, ConversationList, useConversationsQuery, useMarkReadMutation, useOpenConversationMutations, useSocketSubscription } from "@features/messages";
import { Box, Card, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const MessagesPage = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [searchParams, setSearchParams] = useSearchParams();

    const { data: conversations = [] } = useConversationsQuery();
    const { typing } = useSocketSubscription(selectedId);
    const markRead = useMarkReadMutation();
    const openConversation = useOpenConversationMutations();

    useEffect(() => {
        const userId = searchParams.get('userId');
        if(!userId){
            return;
        }

        openConversation.mutate(userId, {
            onSuccess: (res) => {
                setSelectedId(res.data.id);
                setSearchParams({}, { replace: true });
            },
        });
    }, [searchParams, openConversation, setSearchParams]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        markRead.mutate(id);
    };

    const selectedConversation = conversations.find((c) => c.id === selectedId);

    return (
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ boxShadow: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', height: 'calc(100vh - 180px', minHeight: 420 }}>

                    <Box
                        sx={{
                            width: { xs: '100%', md: 340 },
                            borderRight: { mb: '1px solid' },
                            borderColor: 'divider',
                            overflowY: 'auto',
                            display: { xs: selectedConversation ? 'none' : 'block', md: 'block' },
                        }}
                    >
                        <ConversationList selectedId={selectedId} onSelect={handleSelect} />
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            flexDirection: 'column',
                            display: { xs: selectedConversation ? 'flex': 'none', md: 'flex' },
                        }}
                    >
                        {selectedConversation ? (
                            <ChatWindow
                                conversation={selectedConversation}
                                typingUserId={typing[selectedConversation.id] ?? []}
                            />
                        ) : (
                            <Box sx={{ m: 'auto', textAlign: 'center', p: 2 }}>
                                <Typography color="text.secondary">
                                    Выберите диалог, чтобы начать переписку.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Card>
        </Container>
    );
};