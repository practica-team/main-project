import { usePostsQuery } from "../model/usePosts";
import { Alert, Box, Button, Typography } from "@mui/material";
import { SkeletonPost } from "./SkeletonPost";
import { PostCard } from "./PostCard";

export const Feed = () => {
    const { data: posts = [], isLoading, isError, error, refetch } = usePostsQuery();

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error instanceof Error ? error.message : "Не удалось загрузить посты"}
                </Alert>
                <Button variant="outlined" onClick={() => refetch()} sx={{ textTransform: "none" }}>
                    Повторить попытку
                </Button>
            </Box>
        );
    }

    if (posts.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px dashed", 
                    borderRadius: 1,
                    borderColor: "divider",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Нет постов
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Начните создавать посты, чтобы их здесь увидеть.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </Box>
    );
};