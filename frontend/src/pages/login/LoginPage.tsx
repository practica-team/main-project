import { LoginForm } from "@features/auth";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const LoginPage = () => {
    return (
        <Box>
            <LoginForm />
            <Box sx={{ mt:2, textAlign: 'center'}}>
                <Typography variant="body2" color="text.secondary">
                    Нет аккаунта?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                        Зарегистрироваться
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};