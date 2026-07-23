import { useAuth } from "@features/auth";
import { Feed, usePosts } from "@features/feed";
import { postApi } from "@entities/post";
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Alert } from "@mui/material";
import { useState, useRef } from "react";

export const HomePage = () => {
    const { user } = useAuth();
    const { addPost } = usePosts();
    
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const clearForm = () => {
        setContent('');
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!user || !content.trim()) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('text', content); 
            if (image) {
                formData.append('image', image);
            }

            const response = await postApi.createPost(formData);
            
            addPost(response.data);
            clearForm();
            
        } catch (err: unknown) {
            console.error('Ошибка при создании поста:', err);
            const errorMessage = err && typeof err === 'object' && 'response' in err 
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
                : 'Не удалось опубликовать пост. Попробуйте позже.';
            setError(errorMessage || 'Не удалось опубликовать пост. Попробуйте позже.');     
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            {user && (
                <Grid {...{item: true, xs: 12}}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Что у вас нового, {user.username}?
                            </Typography>
                            
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            
                            <TextField
                                multiline
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Что нового"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            
                            {image && (
                                <Box sx={{ mb: 2, textAlign: 'center', position: 'relative' }}>
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt="Просмотр" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '200px', 
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }} 
                                    />
                                    <Button 
                                        size="small" 
                                        color="error" 
                                        onClick={() => setImage(null)}
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        Удалить
                                    </Button>
                                </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Box>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload">
                                        <Button 
                                            variant="outlined" 
                                            component="span"
                                            startIcon={<span></span>}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Фото
                                        </Button>
                                    </label>
                                </Box>
                                
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !content.trim()}
                                    sx={{ textTransform: 'none', px: 4 }}
                                >
                                    {isLoading ? 'Публикация...' : 'Опубликовать'}
                                </Button>
                            </Box>
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