import { Send } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";

interface IMessageInputProps{
    onSend: (content: string) => void;
    disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: IMessageInputProps) => {
    const [ value, setValue ] = useState('');

    const submit = () => {
        const trimmed = value.trim();
        if(!trimmed || disabled){
            return;
        } 
        onSend(trimmed);
        setValue('');
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
        }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Напишите сообщение."
                multiline
                maxRows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey){
                        e.preventDefault();
                        submit();
                    }
                }}
            />
            <IconButton
                color="primary"
                onClick={submit}
                disabled={disabled || !value.trim()}
                sx={{ alignSelf: 'flex-end' }}
            >
                <Send />
            </IconButton>
        </Box>
    );
};