import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@app/providers";
import "./app/styles/global.css";
import { AppRouter } from "@app";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <AppRouter />
        </Providers>
    </StrictMode>
);
