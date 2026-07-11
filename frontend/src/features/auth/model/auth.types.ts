export interface IAuthType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}