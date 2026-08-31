import { Alert, Avatar, Badge, Box, Button, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useConversationsQuery } from "../model/useMessages";

interface IConversationListProps {
    selectedId?: string,
    onSelect: (id: string) => void;
}


export const ConversationList = ({ selectedId, onSelect }: IConversationListProps) => {
    const { data: conversations = [], isLoading, isError, refetch } = useConversationsQuery();

    if(isLoading){
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if(isError){
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 1 }}>Не удалось загрузить диалоги.</Alert>
                <Button size="small" onClick={() => refetch()} sx={{ textTransform: 'none' }}>
                    Повторить
                </Button>
            </Box>
        );
    }

    if(conversations.length === 0){
        return (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                Нет диалогов. Можете написать кому-нибудь со страницы профиля.
            </Typography>
        );
    }

    return (
        <List disablePadding>
            {conversations.map((conv) => {
                const partner = conv.participants[0];
                return(
                    <ListItemButton
                        key={conv.id}
                        selected={selectedId === conv.id}
                        onClick={() => onSelect(conv.id)}
                        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        <ListItemAvatar>
                            <Badge
                                color="error"
                                badgeContent={conv.unreadCount ?? 0}
                                invisible={(conv.unreadCount ?? 0) === 0}
                            >
                                <Avatar src={partner?.avatarPath}>
                                    {partner ? partner.username.charAt(0).toUpperCase() : '?!'}
                                </Avatar>
                            </Badge>
                        </ListItemAvatar>

                        <ListItemText
                            primary={partner?.username ?? 'Диалог'}
                            secondary={conv.lastMessage?.content ?? 'Нет сообщений'}
                            slotProps={{
                                primary: {
                                    sx: {fontWeight: 600},
                                    noWrap: true,
                                },
                                secondary: {
                                    noWrap: true,
                                }
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );
};