import { RegisterForm } from "@features/auth/ui";
import { Box, Link, Typography } from "@mui/material";
import { Link  as RouterLink} from "react-router-dom";

export const RegisterPage = () => {
    return (
        <Box sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Box sx={{width: '100%'}}>
                <RegisterForm />
                <Box sx={{ mt: 2, textAlign: 'center'}}>
                    <Typography variant="body2" color="text.secondary">
                        Уже есть аккаунт?{' '}
                        <Link component={RouterLink} to='/login' underline="hover">
                            Войти
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};