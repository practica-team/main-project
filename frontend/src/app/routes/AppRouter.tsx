import { FriendsPage } from "@pages/friends";
import { HomePage } from "@pages/home";
import { LoginPage } from "@pages/login";
import { MessagesPage } from "@pages/messages";
import { NotFoundPage } from "@pages/not-found";
import { ProfilePage } from "@pages/profile";
import { RegisterPage } from "@pages/register";
import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "@app";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
    return (
        <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
                        
            <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
