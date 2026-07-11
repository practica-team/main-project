import { $api } from "@shared";
import type { ILoginResponse, ILoginRequest, IRegisterRequest, IRegisterResponse } from "../model";

export const authApi = {
    login: (data: ILoginRequest) => $api.post<ILoginResponse>('/auth/login', data),

    register: (data: IRegisterRequest) => $api.post<IRegisterResponse>('/auth/register', data),
};
