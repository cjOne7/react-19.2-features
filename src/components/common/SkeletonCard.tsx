import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import React from "react";

interface Props {
  count?: number;
}

export function SkeletonCard({ count = 1 }: Props): React.ReactElement {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} sx={{ mb: 2 }}>
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
}
