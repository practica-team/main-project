import { $api } from "@shared";
import type { IPost, IPostCreate } from "../model/types";

export const postApi = {
    getPosts: () => $api.get<IPost[]>('/post'),

    createPost: (data: IPostCreate) => $api.post<IPost>('/post', data),

    likePost: (postId: string) => $api.post(`/post/${postId}/like`),

    deletePost: (postId: string) => $api.post(`/post/${postId}`),
};