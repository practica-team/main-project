import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../model';
import { useState } from 'react';
import { authApi } from '../api';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try{
            setError(null);

            const response = await authApi.login(data);

            const { token } = response.data;

            login(token);

            navigate('/');
        } catch(err: unknown){
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Ошибка при входе. Проверьте данные.');
        }
    };

    return (
        <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{ 
                maxWidth: 400, 
                mx: 'auto',
                mt: 8,
                p: 3,
                boxShadow: 3,
                borderRadius: 2
            }}
        >
            <Typography variant='h5' gutterBottom sx={{textAlign: 'center'}}>
                Вход в аккаунт
            </Typography>

            {error && <Alert severity='error' sx={{mb:2}}>{error}</Alert>}

            <TextField
                label='Email'
                type='email'
                fullWidth
                margin='normal'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField
                label='Password'
                type='password'
                fullWidth
                margin='normal'
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            <Button
                type='submit'
                variant='contained'
                fullWidth
                disabled={isSubmitting}
                sx={{mt: 3, py: 1.5}}
            >
                {isSubmitting ? 'Вход' : 'Войти'}
            </Button>
        </Box>
    );
};
