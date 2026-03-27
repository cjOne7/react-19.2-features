import React, { type ReactElement, Suspense } from "react";
import { Box, Button, Card, CardActions, CardContent, Chip, Collapse, Typography } from "@mui/material";
import { postsApi } from "@/api";
import { ErrorBoundary, SkeletonCard } from "@/components";
import { createCachedPromise } from "@/utils";
import { PostComments } from "@/features";
import type { Comment, Post } from "@/types";

interface PostCardProps {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, expanded, onToggle }): ReactElement => {
  // Lazily create a cached promise only when the card is first expanded
  const commentsPromise = expanded
    ? createCachedPromise<Comment[]>(`comments/${post.id}`, () => postsApi.getComments(post.id))
    : null;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {post.title}
          </Typography>
          <Chip label={`#${post.id}`} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {post.body}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={onToggle}>
          {expanded ? "Hide Comments" : "View Comments"}
        </Button>
      </CardActions>

      <Collapse in={expanded} unmountOnExit={false}>
        <CardContent sx={{ pt: 0 }}>
          {commentsPromise && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonCard count={2} />}>
                <PostComments commentsPromise={commentsPromise} />
              </Suspense>
            </ErrorBoundary>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};
