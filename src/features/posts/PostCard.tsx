import React, { Suspense } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { PostComments } from "./PostComments";
import { createCachedPromise } from "@/utils/promiseCache";
import { postsApi } from "@/api/posts.api";
import type { Post } from "@/types";

interface Props {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
}

export function PostCard({ post, expanded, onToggle }: Props): React.ReactElement {
  // Lazily create a cached promise only when the card is first expanded
  const commentsPromise = expanded
    ? createCachedPromise(`comments/${post.id}`, () => postsApi.getComments(post.id))
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
}
