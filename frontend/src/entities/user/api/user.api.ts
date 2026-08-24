import { $api } from "@shared";
import type  { IUser } from "../model/types";

export const userApi = {
    getMe: () => $api.get<IUser>('/users/me'),
    getUserById: (userId: string) => $api.get<IUser>(`users/${userId}`),
    updateProfile: (formData: FormData) => $api.put<IUser>(`/users/me`, formData),
};