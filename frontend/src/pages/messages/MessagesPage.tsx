import { ChatWindow, ConversationList, setActiveConversationId, useConversationsQuery, useMarkReadMutation, useOpenConversationMutations, useSocketSubscription } from "@features/messages";
import { Box, Card, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const MessagesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const urlConversationId = searchParams.get('conversation') ?? undefined;
    const [manualId, setManualId] = useState<string | undefined>();

    const selectedId = urlConversationId ?? manualId;
    const { data: conversations = [] } = useConversationsQuery();
    const { typing } = useSocketSubscription(selectedId);
    const { mutate: markReadMutate } = useMarkReadMutation();
    const { mutate: openConversationMutate } = useOpenConversationMutations();

    const userIdParam = searchParams.get('userId');

    useEffect(() => {
        if(!userIdParam){
            return;
        }

        openConversationMutate(userIdParam, {
            onSuccess: (res) => {
                setSearchParams({ conversation: res.data.id }, { replace: true });
            },
        });
    }, [userIdParam, openConversationMutate, setSearchParams]);

    useEffect(() => {
        if(urlConversationId){
            markReadMutate(urlConversationId);
        }
    }, [urlConversationId, markReadMutate]);

    useEffect(() => {
        setActiveConversationId(selectedId);
        return () => setActiveConversationId(undefined);
    });

    const handleSelect = (id: string) => {
        if(urlConversationId){
            setSearchParams({}, { replace: true });
        }
        setManualId(id);
        markReadMutate(id);
    };

    const selectedConversation = conversations.find((c) => c.id === selectedId);

    return (
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ boxShadow: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', height: 'calc(100vh - 180px)', minHeight: 420 }}>

                    <Box
                        sx={{
                            width: { xs: '100%', md: 340 },
                            borderRight: { md: '1px solid' },
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