import React, { type ReactElement, Suspense, use } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { usersApi } from "@/api/users.api";
import { usePageAnalytics } from "@/hooks/useAnalytics";
import { createCachedPromise } from "@/utils/promiseCache";
import type { User } from "@/types";
import { AddUserForm } from "./AddUserForm";
import { UsersList } from "./UserCard";
import { UsersProvider } from "./UsersContext";

const usersPromise = createCachedPromise<User[]>("users/all", usersApi.getAll);

// Inner component uses use() — must be inside Suspense
const UsersPageInner: React.FC = (): ReactElement => {
  const initialUsers = use<User[]>(usersPromise);

  return (
    <UsersProvider initialUsers={initialUsers}>
      <AddUserForm />
      <UsersList />
    </UsersProvider>
  );
};

export const UsersPage: React.FC = (): ReactElement => {
  usePageAnalytics("users");

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <Typography variant="h5">Users</Typography>
        <FeatureBadge label="useActionState" color="success" description="Async form action with state" />
        <FeatureBadge label="useOptimistic" color="warning" description="Instant add/remove feedback" />
        <FeatureBadge label="useFormStatus" color="secondary" description="Submit button reads form state" />
        <FeatureBadge label="use(Context)" color="info" description="Context read via use() hook" />
      </Stack>
      <ErrorBoundary>
        <Suspense fallback={<SkeletonCard count={5} />}>
          <UsersPageInner />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
