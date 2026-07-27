import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, type IPost } from "@entities/post";

export const usePostsQuery = () => {
    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await postApi.getPosts();
            return response.data;
        },
    });
};

export const useCreatePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => postApi.createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: number) => postApi.deletePost(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData<IPost[]>(["posts"]);

            queryClient.setQueryData<IPost[]>(["posts"], (old) => (old ? old.filter((p) => p.id !== postId) : []));

            return { previousPosts };
        },
        onError: (_err, _postId, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};

export const useLikePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: number) => postApi.likePost(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData<IPost[]>(["posts"]);

            queryClient.setQueryData<IPost[]>(["posts"], (old) =>
                old
                    ? old.map((p) => {
                        if (p.id === postId) {
                            const newIsLiked = !p.isLiked;
                            return {
                                ...p,
                                isLiked: newIsLiked,
                                likesCount: (p.likesCount || 0) + (newIsLiked ? 1 : -1),
                            };
                        }
                        return p;
                    })
                    : []
            );

            return { previousPosts };
        },
        onError: (_err, _postId, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};