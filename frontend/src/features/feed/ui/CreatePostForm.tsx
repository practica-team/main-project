import { useAuth } from "@features/auth";
import z from "zod";
import { useCreatePostMutation } from "../model/usePosts";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";

const postSchema = z.object({
    content: z.string().min(1, 'Пост не может быть пустым').max(10000, 'Максимум 10000 символов'),
});

type PostFormData = z.infer<typeof postSchema>;

export const CreatePostForm = () => {
    const { user } = useAuth();
    const createPostMutation = useCreatePostMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema)
    });

    const [ image, setImage ] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const clearImage = useCallback(() => {
        setImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const onSubmit = useCallback(
        async (data: PostFormData) => {
            const formData = new FormData();
            formData.append('text', data.content);
            if(image) {
                formData.append('image', image);
            }

            try{
                await createPostMutation.mutateAsync(formData);
                reset();
                clearImage();
            }catch(error){
                console.error('Ошибка создания поста:(CreatePostForm.tsx) ', error);
            }
        }, 
        [createPostMutation, image, reset, clearImage]
    );

    const handleSubmitForm = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
        },
        [handleSubmit, onSubmit]
    );

    const mutationError = createPostMutation.isError
        ? (createPostMutation.error as Error)?.message || 'Не удалось опубликовать пост(CreatePostForm.tsx)'
        : null;
    if(!user) {
        return null;
    }

    return(
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Что у вас нового, {user.username}?
                </Typography>

                {mutationError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => createPostMutation.reset()}>
                        {mutationError}
                    </Alert>
                )}

                <form onSubmit={handleSubmitForm}>
                    <TextField
                        multiline
                        rows={3}
                        placeholder="Что нового?"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        {...register('content')}
                        error={!!errors.content}
                        helperText={errors.content?.message}
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
                                    objectFit: 'cover',
                                }}
                            />
                            <Button size="small" color="error" onClick={clearImage} sx={{ position: 'absolute', top: 0, right: 0 }}>
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
                                    component='span'
                                    startIcon={<AddPhotoAlternate />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Фото
                                </Button>
                            </label>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={createPostMutation.isPending}
                            sx={{ textTransform: 'none', px: 4 }}
                        >
                            {createPostMutation.isPending ? 'Публикация' : 'Опубликовать'}
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
};