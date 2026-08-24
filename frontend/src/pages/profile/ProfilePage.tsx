import { useAuth } from "@features/auth";
import { PostCard } from "@features/feed";
import { useSendRequestMutation } from "@features/friends";
import { useUserPostsQuery, useUserQuery } from "@features/profile";
import { Edit, Message, PersonAdd } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const ProfilePage = () => {
    const { user: currentUser } = useAuth();
    const { id } = useParams<{ id: string}>();

    const profileUserId = id || currentUser?.id;
    const isOwnProfile = !id || id === currentUser?.id;

    const { data: profileUser, isLoading: isUserLoading } = useUserQuery(
        isOwnProfile ? undefined : profileUserId
    );

    const { data: posts = [], isLoading: isPostsLoading } = useUserPostsQuery(profileUserId);

    const user = isOwnProfile ? currentUser : profileUser;
    const isLoading = isOwnProfile ? !currentUser : isUserLoading;

    const sendRequestMutation = useSendRequestMutation();
    const handleAddFriend = () => {
        if(user?.id) {
            sendRequestMutation.mutate(user.id);
        }
    };


    const formattedDate = useMemo(() => {
        if (!user?.createdAt) {
            return null;
        }

        const date = new Date(user.createdAt);

        if (isNaN(date.getTime())) {
            return null;
        }

        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, [user]);


    if(isLoading){
        return (
            <Box sx={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if(!user) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Пользователь не найден
                </Typography>
            </Box>
        );
    }


    return (
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Card sx={{boxShadow: 3, mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid {...{item: true, xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar
                                    src={user.avatarPath}
                                    alt={user.username}
                                    sx={{ width: 120, height: 120 , mx: 'auto', mb: 2 }}
                                >
                                    {user.avatarPath ? null : (user.username.charAt(0).toUpperCase() || '?')}
                                </Avatar>
                                <Typography variant="h5" gutterBottom>
                                    {user.username}
                                </Typography>

                                <Chip
                                    label="Онлайн"
                                    color="success"
                                    size="small"
                                    sx={{fontWeight: 500}}
                                />

                                <Box sx={{ 
                                    mt: 3, 
                                    display: 'flex', 
                                    gap: 1, 
                                    justifyContent: 'center', 
                                    flexWrap: 'wrap'
                                }}>
                                    {isOwnProfile ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<Edit />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Редактировать
                                        </Button>
                                    ):(
                                        <>
                                            <Button
                                                variant="contained"
                                                startIcon={<PersonAdd />}
                                                sx={{ textTransform: 'none' }}
                                                onClick={handleAddFriend}
                                                disabled={sendRequestMutation.isPending}
                                            >
                                                {sendRequestMutation.isPending ? 'Отправка...' : 'Добавить в друзья.'}
                                            </Button>
                                            <Button 
                                                variant="outlined"
                                                startIcon={<Message />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Написать
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid {...{item: true, xs: 12, md: 12}}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Основная информация
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid {...{item: true, xs: 12, sm: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.email}
                                        </Typography>
                                    </Grid>

                                    <Grid {...{item: true, xs: 12, sm: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Имя пользователя
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.username}
                                        </Typography>
                                    </Grid>

                                    {formattedDate && (
                                        <Grid {...{item: true, xs: 12, sm: 6}}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Дата регистрации
                                            </Typography>
                                            <Typography variant="body1">
                                                {formattedDate}
                                            </Typography>
                                        </Grid>
                                    )}

                                    <Grid {...{item: true, xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            ID пользователя
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {user.id}
                                        </Typography>
                                    </Grid>
                                </Grid>             
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        {isOwnProfile ? 'Мои посты' : `Посты ${user.username}`}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {isPostsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ): posts.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center'}}>
                            <Typography variant="body1" color="text.secondary">
                                {isOwnProfile
                                    ? 'У  вас пока нет постов. Вы можете создать первый пост.'
                                    : `У ${user.username} пока нет постов.`
                                }
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};