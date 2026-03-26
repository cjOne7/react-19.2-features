import React, { use, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PostCard } from "./PostCard";
import type { Post } from "@/types";

interface Props {
  postsPromise: Promise<Post[]>;
  filterQuery: string;
}

// use() suspends this component until postsPromise resolves.
// The parent Suspense boundary shows a skeleton in the meantime.
export function PostsList({ postsPromise, filterQuery }: Props): React.ReactElement {
  const posts = use(postsPromise); // ← React 19: read promise value in render
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filterQuery.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(filterQuery.toLowerCase())
          || p.body.toLowerCase().includes(filterQuery.toLowerCase()),
      )
    : posts;

  if (filtered.length === 0) {
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
          onToggle={() => setExpandedId((prev) => (prev === post.id ? null : post.id))}
        />
      ))}
    </Stack>
  );
}
