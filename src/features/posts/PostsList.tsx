import React, { type ReactElement, use, useState } from "react";
import { Stack, Typography } from "@mui/material";
import type { Post } from "@/types";
import { PostCard } from "./PostCard";

interface PostsListProps {
  postsPromise: Promise<Post[]>;
  filterQuery: string;
}

// use() suspends this component until postsPromise resolves.
// The parent Suspense boundary shows a skeleton in the meantime.
export const PostsList: React.FC<PostsListProps> = ({ postsPromise, filterQuery }): ReactElement => {
  const posts = use<Post[]>(postsPromise); // ← React 19: read promise value in render
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filterQuery.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(filterQuery.toLowerCase())
          || post.body.toLowerCase().includes(filterQuery.toLowerCase()),
      )
    : posts;

  if (!filtered.length) {
    return (
      <Typography color="text.secondary" textAlign="center" py={6}>
        No posts match &ldquo;{filterQuery}&rdquo;
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {filtered.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          expanded={expandedId === post.id}
          onToggle={() => setExpandedId((previousExpandedId) => (previousExpandedId === post.id ? null : post.id))}
        />
      ))}
    </Stack>
  );
};
