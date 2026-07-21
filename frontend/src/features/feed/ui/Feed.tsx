import { useAuth } from "@features/auth";
import { usePosts } from "../model/usePosts";
import { Alert, Box, Button, Typography } from "@mui/material";
import { SkeletonPost } from "./SkeletonPost";
import { PostCard } from "./PostCard";

export const Feed = () => {
    const { posts, isLoading, error, refetch} = usePosts();
    const { user } = useAuth();

    if(isLoading && posts.length === 0){
        return(
            <Box sx={{ p: 2}}>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
            </Box>
        );
    }

    if(error){
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    variant="outlined"
                    onClick={refetch}
                    sx={{ textTransform: 'none' }}
                >
                    Повторить попытку
                </Button>
            </Box>
        );
    }

    if(posts.length === 0){
        return (
            <Box sx={{
                p: 4,
                textAlign: 'center',
                border: '1px dashes',
                borderRadius: 1,
                borderColor: 'divider'
            }}>
                <Typography variant="h6" gutterBottom>
                    Нет постов
                </Typography>
                {user && (
                    <Typography variant="body2" color="text.secondary">
                        Начните создавать посты, чтобы их здесь увидеть.
                    </Typography>
                )}
            </Box>
        );
    }


    return (
        <Box sx={{ p: 2 }}>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </Box>
    );
};