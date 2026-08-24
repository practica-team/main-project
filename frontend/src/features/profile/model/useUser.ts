import { userApi } from "@entities/user";
import { useQuery } from "@tanstack/react-query";

export const useUserQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            if(!userId){
                return null;
            }
            const response = await userApi.getUserById(userId);
            return response.data;
        },
        enabled: !!userId,
    });
};