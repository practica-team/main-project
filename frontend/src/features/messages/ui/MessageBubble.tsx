import { type IMessage } from '@entities/message';
import { useAuth } from '@features/auth';
import { Box, Typography } from '@mui/material';
import { formatTime } from '@shared';

export const MessageBubble = ({ message}: { message: IMessage}) => {
    const { user } = useAuth();
    const isOwn = message.senderId === user?.id;

    const time = formatTime(message.createdAt);

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: isOwn ? 'flex-end' : 'flex-start'
        }}>
            <Box
                sx={{
                    maxWidth: '70%',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: isOwn ? 'primary.main' : 'background.paper',
                    color: isOwn ? 'primary.contrastText' : 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                </Typography>  
                <Typography variant='caption' sx={{ display: 'block', textAlign: 'right', opacity: 0.7 }}>
                    {time}
                </Typography>     
            </Box>
        </Box>
    );
};