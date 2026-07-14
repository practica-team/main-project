import { useAuth } from "@features/auth";
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

export const ProfilePage = () => {
    const { user, isLoading } = useAuth();

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
        return <Navigate to='/login' replace />;
    }


    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 4,
            p: 2
        }}>
            <Card sx={{boxShadow: 3}}>
                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3, 
                        mb: 3
                    }}>
                        <Avatar
                            src={user.avatarPath}
                            alt={user.username}
                            sx={{ width: 120, height: 120 }}
                        >
                            {user.avatarPath ? null : (user.username.charAt(0).toUpperCase() || '?')}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component='h1' gutterBottom>
                                {user.username}
                            </Typography>
                            <Chip
                                label="Онлайн"
                                color="success"
                                size="small"
                                sx={{fontWeight: 500}}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ mt: 2 }} />

                    <Grid container spacing={3}>
                        <Grid {...{ item: true, xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                Основная информация
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1">
                                    {user.email}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Имя пользователя
                                </Typography>
                                <Typography variant="body1">
                                    {user.username}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid {...{ item: true, xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                Дополнительная информация
                            </Typography>

                            {formattedDate && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Дата регистрации
                                    </Typography>
                                    <Typography variant="body1">
                                        {formattedDate}
                                    </Typography>
                                </Box>
                            )}
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ID пользователя
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {user.id}
                                </Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};