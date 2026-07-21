import { useAuth } from "@features/auth";
import { Feed } from "@features/feed";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export const HomePage = () => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSubmit = async () => {
        if (!user || !content.trim()) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await new Promise(resolve => setTimeout(resolve, 500));//Симуляция работы с бекендом

            if (!isMountedRef.current) return;

            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <Grid container spacing={3}>
            {user && (
                <Grid {...{item: true, xs: 12}}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Создать пост
                            </Typography>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Что у вас нового?"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '16px',
                                    fontSize: '16px',
                                }}
                            />
                            {image && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Просмотр"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </Box>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    sx={{ mr: 1, textTransform: 'none' }}
                                >
                                    Добавить изображение
                                </Button>
                            </label>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isLoading || !content.trim()}
                                sx={{ textTransform: 'none' }}
                            >
                                {isLoading ? 'Публикуется...' : 'Опубликовать'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            )}

            <Grid {...{item: true, xs: 12}}>
                <Feed />
            </Grid>
        </Grid>
    );
};