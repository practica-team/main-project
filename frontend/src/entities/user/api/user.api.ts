import { $api } from "@shared";
import type  { IUser } from "../model/types";

export const userApi = {
    getMe: () => $api.get<IUser>('/users/me'),
};