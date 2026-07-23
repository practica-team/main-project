import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import type { IMenuSid } from '@shared/types/sidebar-menu.interface';

export const MENU_ITEMS: IMenuSid[] = [
    { path: '/profile', label: 'Моя страница', icon: <PersonIcon /> },
    { path: '/messages', label: 'Сообщения', icon: <MailIcon /> },
    { path: '/friends', label: 'Друзья', icon: <PeopleIcon /> },
];