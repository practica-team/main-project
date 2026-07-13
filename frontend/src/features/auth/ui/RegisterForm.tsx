import { useNavigate } from "react-router-dom";
import z from "zod";
import { useAuth } from "../model";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

const registerSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 буквы'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
    secondPassword: z.string(),
}).refine((data) => data.password === data.secondPassword, {
    message: 'Введенные пароли не совпадают!',
    path: ['secondPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null);

            const response = await authApi.register({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            const { token } = response.data;
            login(token);
            navigate('/');
        } catch (err: unknown){
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Ошибка при регистрации. Проверьте введенные данные.');
        }
    };

    return(
        <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" gutterBottom sx={{textAlign: 'center'}}>
                Регистрация
            </Typography>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <TextField 
                label='Имя'
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <TextField 
                label='Email'
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField 
                label='Password'
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            <TextField 
                label='ConfirmPassword'
                fullWidth
                margin="normal"
                {...register('secondPassword')}
                error={!!errors.secondPassword}
                helperText={errors.secondPassword?.message}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{mt: 3, py: 1.5}}
            >
                {isSubmitting ? 'Регистрация' : 'Зарегистрироваться'}
            </Button>
        </Box>
    );
};