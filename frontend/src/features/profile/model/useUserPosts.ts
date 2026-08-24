import { postApi } from "@entities/post";
import { useQuery } from "@tanstack/react-query";

export const useUserPostsQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['posts', 'user', userId],
        queryFn: async () => {
            if(!userId) {
                return [];
            }
            const response = await postApi.getUserPost(userId);
            return response.data;
        },
        enabled: !!userId,
    });
};