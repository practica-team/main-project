import { $api } from "@shared";
import type { IPost } from "../model/types";

interface IPostRawResponse {
    id: number;
    text?: string;
    content?: string;
    authorId?: number | string;
    author?: IPost['author'];
    createdAt: string;
    imagePath?: string;
    likesCount?: number;
    commentsCount?: number;
}

//Удалить маппер когда бекенд будет всё правильно делать
const mapPostResponse = (data: IPostRawResponse): IPost => ({
    id: typeof data.id === 'number' ? data.id : Number(data.id),
    content: data.text || data.content || '',
    author: data.author || {
        id: String(data.authorId),
        username: 'User',
        email: '',
        avatarPath: undefined,
    },
    createdAt: data.createdAt,
    imagePath: data.imagePath,
    likesCount: data.likesCount || 0,
    commentsCount: data.commentsCount || 0,
});

export const postApi = {
    getPosts: async () => {
        const response = await $api.get<IPostRawResponse[]>('/posts');
        return {...response, data: response.data.map(mapPostResponse) };
    },
    
    createPost: async (formData: FormData) => {
        const response = await $api.post<IPostRawResponse>('/posts', formData);
        return { ...response, data: mapPostResponse(response.data) };
    },
    
    likePost: (postId: number) => $api.post(`/posts/${postId}/like`),
    
    deletePost: (postId: number) => $api.delete(`/posts/${postId}`),
};