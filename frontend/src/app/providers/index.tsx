import { QueryProvider } from "./QueryProvider";
import { RouterProvider } from "./RouterProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { SocketProvider } from "./SocketProvider";

export const Providers = ({children}: { children: React.ReactNode}) => {
    return (
        <QueryProvider>
            <ThemeProvider>
                <RouterProvider>
                    <AuthProvider>
                        <SocketProvider>
                            {children}
                        </SocketProvider>                        
                    </AuthProvider>                   
                </RouterProvider>            
            </ThemeProvider>           
        </QueryProvider>
    );
};
