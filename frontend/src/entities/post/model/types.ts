import type { IUser } from "@entities/user";

export interface IPost {
    id: string;
    content: string;
    author: IUser;
    createdAt: string;
    likeCount?: number;
    commentsCount?: number;
    imagePath?: string;
};

export interface IPostCreate {
    content: string;
    imagePath?: string;
};