import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatRelativeTime = (date: Date | string, options?: { addSuffix?: boolean }): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
        return "неизвестная дата";
    }

    return formatDistanceToNow(parsedDate, {
        addSuffix: options?.addSuffix ?? true,
        locale: ru,
    });
};
