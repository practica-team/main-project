export interface IAuthType {
    isAuthenticated: boolean;
    login: (token: string) => void;
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