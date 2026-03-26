import React, { use } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import type { Comment } from "@/types";

interface Props {
  commentsPromise: Promise<Comment[]>;
}

export function PostComments({ commentsPromise }: Props): React.ReactElement {
  const comments = use(commentsPromise);

  return (
    <Stack spacing={1.5} mt={1}>
      <Typography variant="subtitle2" color="text.secondary">
        {comments.length} Comments
      </Typography>
      <Divider />
      {comments.map((c) => (
        <Box key={c.id}>
          <Typography variant="caption" fontWeight={700}>
            {c.name} · {c.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {c.body}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
