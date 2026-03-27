import React, { type ReactElement, Suspense, useState, useTransition } from "react";
import { Box, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { postsApi } from "@/api/posts.api";
import { usePageAnalytics } from "@/hooks/useAnalytics";
import { createCachedPromise } from "@/utils/promiseCache";
import type { Post } from "@/types";
import { PostsList } from "./PostsList";

// Promise is created OUTSIDE the render cycle → stable reference for use()
const postsPromise = createCachedPromise<Post[]>("posts/all", postsApi.getAll);

export const PostsPage: React.FC = (): ReactElement => {
  usePageAnalytics("posts");

  const [rawQuery, setRawQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("");

  // useTransition: search filtering is a non-urgent update
  // the input stays responsive while React prepares the filtered list
  const [isFiltering, startFilterTransition] = useTransition();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setRawQuery(value); // urgent — input must reflect immediately
    startFilterTransition(() => setFilterQuery(value)); // non-urgent — re-render list
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h5">Posts</Typography>
        <FeatureBadge label="use()" description="Reads postsPromise directly in PostsList" />
        <FeatureBadge label="useTransition" color="secondary" description="Search filtering is non-blocking" />
        <FeatureBadge label="<Suspense>" color="info" description="Wraps async PostsList" />
      </Stack>

      <TextField
        fullWidth
        placeholder="Search posts… (useTransition keeps input responsive)"
        value={rawQuery}
        onChange={handleSearch}
        size="small"
        sx={{ mb: 2 }}
      />

      {isFiltering && <LinearProgress sx={{ mb: 1, borderRadius: 1 }} />}

      <ErrorBoundary>
        {/* Suspense boundary: shows skeleton while postsPromise resolves */}
        <Suspense fallback={<SkeletonCard count={6} />}>
          <PostsList postsPromise={postsPromise} filterQuery={filterQuery} />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
