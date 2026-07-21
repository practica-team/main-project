import { Box, Skeleton } from "@mui/material";

export const SkeletonPost = () => (
    <Box sx={{
        p: 2, 
        mb: 2,
        borderRadius: 1,
        boxShadow: 1,
        backgroundColor: 'background.paper'
    }}>
        <Box sx={{ display: "flex", alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
            <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width='60%' height={24} />
                <Skeleton variant="text" width='30%' height={16} />
            </Box>
        </Box>

        <Skeleton variant="rounded" width='100%' height={120} sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Skeleton variant="text" width='20%' height={24} />
            <Skeleton variant="text" width='15%' height={24} />
        </Box>
    </Box>
);