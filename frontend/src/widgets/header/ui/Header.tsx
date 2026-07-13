import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Badge, Box, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from "react-router-dom";
import styles from './Header.module.css';
import { LogoutButton } from "@features/auth";

export const Header = () => {
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
                    Аналог ВКонтакте
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

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton className={styles.notificationsButton}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <LogoutButton />
                </Box>
            </Toolbar>
        </AppBar>
    );
};