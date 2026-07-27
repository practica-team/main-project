import { useAuth } from "@features/auth";
import { type IPost } from "@entities/post";
import { useDeletePostMutation, useLikePostMutation } from "../model/usePosts";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { Chat, Delete, Favorite, FavoriteBorder } from "@mui/icons-material";
import { formatRelativeTime } from "@shared";

export const PostCard = ({ post }: { post: IPost }) => {
    const { user } = useAuth();

    const deleteMutation = useDeletePostMutation();
    const likeMutation = useLikePostMutation();

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    };

    const handleLike = () => {
        likeMutation.mutate(post.id);
    };

    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                boxShadow: 1,
                backgroundColor: "background.paper",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar src={post.author.avatarPath} sx={{ mr: 1, width: 40, height: 40 }}>
                    {post.author.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {post.author.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatRelativeTime(post.createdAt)}
                    </Typography>
                </Box>
                {user?.id === post.author.id && (
                    <IconButton
                        onClick={handleDelete}
                        sx={{ ml: "auto" }}
                        color="error"
                        disabled={deleteMutation.isPending} 
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
                {post.content}
            </Typography>

            {post.imagePath && (
                <Box
                    component="img"
                    src={post.imagePath}
                    alt="Пост"
                    sx={{
                        width: "100%",
                        borderRadius: 1,
                        mb: 2,
                        objectFit: "cover",
                    }}
                />
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={handleLike} color={post.isLiked ? "error" : "default"} disabled={likeMutation.isPending}>
                        {post.isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>
                    <Typography
                        variant="body2"
                        color={post.isLiked ? "error" : "text.secondary"}
                        sx={{ fontWeight: post.isLiked ? 600 : 400 }}
                    >
                        {post.likesCount || 0}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="primary">
                        <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.likesCount || 0}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="primary">
                        <Chat fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.commentsCount || 0}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};