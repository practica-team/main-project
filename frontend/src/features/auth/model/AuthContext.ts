import { createContext } from "react";
import type { IAuthType } from "./auth.types";

export const AuthContext = createContext<IAuthType | null>(null);