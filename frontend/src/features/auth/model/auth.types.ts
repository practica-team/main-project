import type { IUser } from "@entities/user";

export interface IAuthType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: IUser | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
}



export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    name?: string;
}


export interface ILoginResponse {
    token: string;
}

export interface IRegisterResponse {
    token: string;
}