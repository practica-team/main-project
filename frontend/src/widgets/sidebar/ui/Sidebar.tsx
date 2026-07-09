import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { MENU_ITEMS } from '@shared';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';


export const SiderBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={{ width: '200px' }}>
            <Typography
                variant="subtitle2"
                sx={{ color: '#818c99', mb: 1, px: 1 }}
            >
                МЕНЮ
            </Typography>
            <List disablePadding>
                {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                        >
                            <ListItemIcon className={styles.menuIcon}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                classes={{
                                    primary: `${styles.menuText} ${isActive ? styles.menuTextActive : ''}`,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </aside>
    );
};