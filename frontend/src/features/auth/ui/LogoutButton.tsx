import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../model';

export const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    return (
        <Button 
            variant="outlined" 
            color="inherit" 
            onClick={handleLogout}
            sx={{ textTransform: 'none' }} 
        >
            Выйти
        </Button>
    );
};