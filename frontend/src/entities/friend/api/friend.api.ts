import { $api } from "@shared";
import type { IFriendShip } from "../model/types";

export const friendApi = {
    getFriends: () => $api.get<IFriendShip[]>('/friendships/friends'),
    getIncomingRequests: () => $api.get<IFriendShip[]>('/friendships/incoming'),
    getOutgoingRequests: () => $api.get<IFriendShip[]>('/friendships/outgoing'),

    sendRequest: (friendId: string) => $api.post<IFriendShip>('/friendships/request', { friendId }),
    acceptRequest: (requestId: string) => $api.post<IFriendShip>(`/friendship/${requestId}/accept`),
    declineRequest: (requestId: string) => $api.post<IFriendShip>(`/friendships/${requestId}/decline`),
    removeFriend: (friendId: string) => $api.delete(`/friendship/${friendId}`),
};