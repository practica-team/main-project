import type { IUser } from "@entities/user";

export interface IPost {
    id: number;
    content: string;
    author: IUser;
    createdAt: string;
    likesCount?: number;
    commentsCount?: number;
    imagePath?: string;
}

export interface IPostCreatePayload{
    text: string;
    image?: File;
}

export interface IPostCreate {
    content: string;
    imagePath?: string;
}