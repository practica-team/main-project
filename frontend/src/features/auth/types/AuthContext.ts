import { createContext } from "react";
import type { IAuthType } from "./auth-provider.interface";

export const AuthContext = createContext<IAuthType | null>(null);