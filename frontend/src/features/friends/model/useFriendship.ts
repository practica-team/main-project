import { friendApi, type IFriendShip } from "@entities/friend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFriendsQuery = () => {
    return useQuery({
        queryKey: ['friendships', 'friends'],
        queryFn: () => friendApi.getFriends().then(res => res.data),
    });
};

export const useIncomingRequestsQuery = () => {
    return useQuery({
        queryKey: ['friendships', 'incoming'],
        queryFn: () => friendApi.getIncomingRequests().then(res => res.data),
    });
};

export const useOutgoingRequestsQuery = () => {
    return useQuery({
        queryKey: ['friendships', 'outgoing'],
        queryFn: () => friendApi.getOutgoingRequests().then(res => res.data),
    });
};



export const useSendRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (friendId: string) => friendApi.sendRequest(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendships'] });
        },
    });
};

export const useAcceptRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => friendApi.acceptRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friendships', 'incoming'] });
            const previousIncoming = queryClient.getQueryData<IFriendShip[]>(['friendships', 'incoming']);

            queryClient.setQueryData(['friendships', 'incoming'], (old: IFriendShip[] | undefined) => 
                old ? old.filter(r => r.id !== requestId) : []
            );
            return { previousIncoming };
        },
        onError: (_err, _requestId, context) => {
            if(context?.previousIncoming){
                queryClient.setQueryData(['friendships', 'incoming'], context.previousIncoming);
            }
        }, 
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendships'] });
        },
    });
};

export const useDeclineRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => friendApi.declineRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friendships', 'incoming'] });
            const previousIncoming = queryClient.getQueryData<IFriendShip[]>(['friendships', 'incoming' ]);

            queryClient.setQueryData(['friendships', 'incoming'], (old: IFriendShip[] | undefined) => 
                old ? old.filter(r => r.id !== requestId) : []
            );
            return { previousIncoming };
        },
        onError: (_err, _requestId, context) => {
            if(context?.previousIncoming){
                queryClient.setQueryData(['friendships', 'incoming'], context.previousIncoming);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendships'] });
        },
    });
};

export const useRemoveFriendMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (friendId: string) => friendApi.removeFriend(friendId),
        onMutate: async (friendId) => {
            await queryClient.cancelQueries({ queryKey: ['friendships', 'friends' ]});
            const previousFriends = queryClient.getQueryData<IFriendShip[]>(['friendships', 'friends' ]);

            queryClient.setQueryData(['friendships', 'friends'], (old: IFriendShip[] | undefined) => 
                old ? old.filter(f => f.friendId !== friendId) : []
            );
            return { previousFriends };
        },
        onError: (_err, _friendId, context) => {
            if(context?.previousFriends){
                queryClient.setQueryData(['friendships', 'friends'], context.previousFriends);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendships'] });
        },
    });
};

