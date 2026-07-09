import { FriendsPage } from "@pages/friends";
import { HomePage } from "@pages/home";
import { LoginPage } from "@pages/login";
import { MessagesPage } from "@pages/messages";
import { NotFoundPage } from "@pages/not-found";
import { ProfilePage } from "@pages/profile";
import { RegisterPage } from "@pages/register";
import { Layout } from "@widgets/layout/ui/Layout";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
    return (
        <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
                        
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
