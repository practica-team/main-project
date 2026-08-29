import type { IMessage } from "@entities/message";
import type { InfiniteData } from "@tanstack/react-query";

export type MessagesCache = InfiniteData<IMessage[], number> | undefined;

export const appendToLastPage = (old: MessagesCache, msg: IMessage): MessagesCache => {
    if(!old) {
        return old;
    }
    const pages = old.pages.slice();
    const last = pages[pages.length - 1] ?? [];
    if(last.some((m) => m.id === msg.id)){
        return old;
    }
    pages[pages.length - 1] = [...last, msg];
    return { ...old, pages };
};

export const replaceMessage = (old: MessagesCache, tempId: string, real: IMessage): MessagesCache => {
    if(!old) {
        return old;
    }
    return { ...old, pages: old.pages.map((page) => page.map((m) => (m.id === tempId ? real : m))) };
};

export const removeMessage = (old: MessagesCache, id: string): MessagesCache => {
    if(!old) {
        return old;
    }
    return {...old, pages: old.pages.map((page) => page.filter((m) => m.id !== id)) };
};