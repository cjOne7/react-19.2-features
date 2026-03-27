import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import React, { type ReactElement } from "react";

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }): ReactElement => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Stack spacing={1} mt={1}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="75%" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
