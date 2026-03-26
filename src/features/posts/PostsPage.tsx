import React, { useState, useTransition, Suspense } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PostsList } from "./PostsList";
import { postsApi } from "@/api/posts.api";
import { createCachedPromise } from "@/utils/promiseCache";
import { usePageAnalytics } from "@/hooks/useAnalytics";

// Promise is created OUTSIDE the render cycle → stable reference for use()
const postsPromise = createCachedPromise("posts/all", postsApi.getAll);

export const PostsPage: React.FC = (): React.ReactElement => {
  usePageAnalytics("posts");

  const [rawQuery, setRawQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // useTransition: search filtering is a non-urgent update
  // the input stays responsive while React prepares the filtered list
  const [isFiltering, startFilterTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
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
