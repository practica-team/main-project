import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Box, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import { LogoutButton, useAuth } from "@features/auth";

export const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <AppBar
            position="static"
            className={styles.header}
        >
            <Toolbar className={styles.toolbar}>
                <Typography
                    variant="h6"
                    component={Link}
                    to='/'
                    className={styles.logo}
                >
                    Кампус
                </Typography>

                <Box
                    className={styles.searchBox}
                >
                    <SearchIcon sx={{
                        color: 'white',
                        mr: 1,
                    }}/>
                    <InputBase 
                        placeholder="Поиск"
                        className={styles.searchInput}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center'}}>
                    <IconButton className={styles.notificationsButton}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
 
                    {user && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
                            <Avatar
                                src={user?.avatarPath}
                                alt={user?.username}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    cursor: 'pointer'
                                }}
                                onClick={handleProfileClick}
                            >
                                {!user?.avatarPath && user?.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography
                                variant="body2"
                                sx={{
                                    display: { xs: 'none', sm: 'block'},
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                                onClick={handleProfileClick}
                            >
                                {user?.username}
                            </Typography>
                        </Box>  
                    )}

                    <Box sx={{ml: 1}}>
                        <LogoutButton />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};