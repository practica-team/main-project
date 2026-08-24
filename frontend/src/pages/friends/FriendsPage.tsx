import { useAcceptRequestMutation, useDeclineRequestMutation, useFriendsQuery, useIncomingRequestsQuery, useRemoveFriendMutation } from "@features/friends";
import { Check, Close, PersonRemove } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, CircularProgress, Container, List, ListItem, ListItemAvatar, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const FriendsPage = () => {
    const [ tabValue, setTabValue ] = useState(0);

    const { data: friends = [], isLoading: isFriendsLoading } = useFriendsQuery();
    const { data: incoming = [], isLoading: isIncomingLoading } = useIncomingRequestsQuery();
    const { data: outgoing = [], isLoading: isOutgoingLoading } = useIncomingRequestsQuery();

    const acceptMutation = useAcceptRequestMutation();
    const declineMutation = useDeclineRequestMutation();
    const removeMutation = useRemoveFriendMutation();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const isLoading = isFriendsLoading || isIncomingLoading || isOutgoingLoading;

    if(isLoading && friends.length === 0 && incoming.length === 0 && outgoing.length === 0){
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth='md' sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Друзья
            </Typography>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label={`Мои друзья (${friends.length})`}/>
                <Tab label={`Заявки в друзья (${incoming.length})`}/>
                <Tab label={`Исходящие заявки (${outgoing.length})`}/>
            </Tabs>

            {tabValue === 0 && (
                <Box>
                    {friends.length === 0 ? (
                        <Alert severity="info">У вас пока нет друзей.</Alert>
                    ) : (
                        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1}}>
                            {friends.map((friendship) => (
                                <ListItem
                                    key={friendship.id}
                                    secondaryAction={
                                        <Button
                                            color="error"
                                            startIcon={<PersonRemove />}
                                            onClick={() => removeMutation.mutate(friendship.friendId)}
                                            disabled={removeMutation.isPending}
                                        >
                                            Удалить
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={friendship.friend?.avatarPath}
                                            component={Link}
                                            to={`/profile/${friendship.friendId}`}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {friendship.friend?.username.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friendship.friend?.username}
                                        secondary='Ваш друг'
                                        slotProps={{
                                            primary: {
                                                component: Link,
                                                to: `/profile/${friendship.friendId}`,
                                                sx: { textDecoration: 'none', color: 'text.primary', fontWeight: 600}
                                            }
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    {incoming.length === 0 ? (
                        <Alert severity="info">У вас нет новых заявок в друзья.</Alert>
                    ) : (
                        <List sx={{ 
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 1
                        }}>
                            {incoming.map((request) => (
                                <ListItem
                                    key={request.id}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<Check />}
                                                onClick={() => acceptMutation.mutate(request.id)}
                                                disabled={acceptMutation.isPending}
                                            >
                                                Принять
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                startIcon={<Close />}
                                                onClick={() => declineMutation.mutate(request.id)}
                                                disabled={declineMutation.isPending}
                                            >
                                                Отклонить
                                            </Button>
                                        </Box>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={request.friend?.avatarPath}
                                            component={Link}
                                            to={`/profile/${request.userId}`}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {request.friend?.avatarPath}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.friend?.username}
                                        secondary='Хочет добавить вас в рузья'
                                        slotProps={{
                                            primary: {
                                                component: Link,
                                                to: `/profile/${request.userId}`,
                                                sx: { textDecoration: 'none', color: 'text.primary', fontWeight: 600 }
                                            }
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    {outgoing.length === 0 ? (
                        <Alert severity="info">Вы никому не отправляли заявок.</Alert>
                    ) : (
                        <List sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 1
                        }}>
                            {outgoing.map((request) => (
                                <ListItem
                                    key={request.id}
                                    secondaryAction={
                                        <Button
                                            color="error"
                                            size="small"
                                            startIcon={<Close />}
                                            onClick={() => declineMutation.mutate(request.id)}
                                            disabled={declineMutation.isPending} 
                                        >
                                            Отменить
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={request.friend?.avatarPath}
                                            component={Link}
                                            to={`/profile/${request.friendId}`}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {request.friend?.username.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.friend?.username}
                                        secondary='Заявка отправлена'
                                        slotProps={{
                                            primary: {
                                                component: Link,
                                                to: `/profile/${request.friendId}`,
                                                sx: { textDecoration: 'none', color: 'text.primary', fontWeigth: 600 }
                                            }                                           
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </Container>
    );
};