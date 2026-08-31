export const formatTime = (date: string | number | Date): string => {
    return new Date(date).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
};