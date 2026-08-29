import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageKeys, MESSAGES_PAGE_SIZE } from "./keys";
import { type IConversation, messageApi, type IMessage } from "@entities/message";
import { useAuth } from "@features/auth";
import { appendToLastPage, removeMessage, replaceMessage } from "./cache";

export const useConversationsQuery = () => {
    return useQuery({
        queryKey: messageKeys.conversations,
        queryFn: () => messageApi.getConversations().then((res) => res.data),
    });
};


export const useMessagesQuery = (conversationId?: string) => {
    return useInfiniteQuery({
        queryKey: messageKeys.messages(conversationId ?? ''),
        queryFn: async ({ pageParam }) => {
            const res = await messageApi.getMessages(conversationId!, pageParam, MESSAGES_PAGE_SIZE);
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.length === MESSAGES_PAGE_SIZE ?
            allPages.length + 1 : undefined, 

        enabled: !!conversationId,
        select: (data) => data.pages.slice().reverse().flat(),
    });
};


export const useSendMessageMutation = (conversationId: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (content: string) => messageApi.sendMessage(conversationId, content),

        onMutate: async (content) => {
            await queryClient.cancelQueries({ queryKey: messageKeys.messages(conversationId) });

            const temp: IMessage = {
                id: `temp-${Date.now}`,
                conversationId,
                senderId: user?.id ?? 'me',
                sender: user ?? undefined,
                content,
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData<InfiniteData<IMessage[], number>>(messageKeys.messages(conversationId), (old) =>
                appendToLastPage(old, temp)
            );

            queryClient.setQueryData<IConversation[]>(messageKeys.conversations, (old) =>
                old?.map((c) => (c.id === conversationId ? { ...c, lastMessage: temp } : c))
            );
            
            return { tempId: temp.id };
        },

        onSuccess: (res, _content, context) => {
            queryClient.setQueryData<InfiniteData<IMessage[], number>>(messageKeys.messages(conversationId), (old) => 
                replaceMessage(old, context?.tempId ?? '', res.data)
            );
        },

        onError: (_err, _content, context) => {
            if (context?.tempId) {
                queryClient.setQueryData<InfiniteData<IMessage[], number>>(
                    messageKeys.messages(conversationId),
                    (old) => removeMessage(old, context.tempId)
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: messageKeys.conversations });
        }
    });
};


export const useMarkReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: string) => messageApi.markRead(conversationId),
        onMutate: async (conversationId) => {
            queryClient.setQueryData<IConversation[]>(messageKeys.conversations, (old) => 
                old?.map((c) => (c.id === conversationId ? {...c, unreadCount: 0 } : c))
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: messageKeys.conversations });
        }
    });
};