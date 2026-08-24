import type { IUser } from "@entities/user";

export type FriensStatus = 'pending' | 'accepted' | 'rejected';

export interface IFriendShip {
    id: string;
    userId: string;
    friendId: string;
    status: FriensStatus;
    createdAt: string;
    friend?: IUser;
}