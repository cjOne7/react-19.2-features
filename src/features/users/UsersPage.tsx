import React, { use, Suspense } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { UsersProvider } from "./UsersContext";
import { UsersList } from "./UserCard";
import { AddUserForm } from "./AddUserForm";
import { usersApi } from "@/api/users.api";
import { createCachedPromise } from "@/utils/promiseCache";
import { usePageAnalytics } from "@/hooks/useAnalytics";

const usersPromise = createCachedPromise("users/all", usersApi.getAll);

// Inner component uses use() — must be inside Suspense
function UsersPageInner(): React.ReactElement {
  const initialUsers = use(usersPromise);
  return (
    <UsersProvider initialUsers={initialUsers}>
      <AddUserForm />
      <UsersList />
    </UsersProvider>
  );
}

export function UsersPage(): React.ReactElement {
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
}
