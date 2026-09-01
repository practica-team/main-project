import type React from "react";
import { useUnreadTotal } from "../model/useMessages";
import { Badge } from "@mui/material";

export const UnreadMessagesBadge = ({ children }: { children: React.ReactNode }) => {
    const total = useUnreadTotal();

    return(
        <Badge color="error" badgeContent={total} invisible={total === 0} max={99}>
            {children}
        </Badge>
    );
};