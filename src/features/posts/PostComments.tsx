import React, { type ReactElement, use } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { Comment } from "@/types";

interface PostCommentsProps {
  commentsPromise: Promise<Comment[]>;
}

export const PostComments: React.FC<PostCommentsProps> = ({ commentsPromise }): ReactElement => {
  const comments = use<Comment[]>(commentsPromise);

  return (
    <Stack spacing={1.5} mt={1}>
      <Typography variant="subtitle2" color="text.secondary">
        {comments.length} Comments
      </Typography>
      <Divider />
      {comments.map((comment) => (
        <Box key={comment.id}>
          <Typography variant="caption" fontWeight={700}>
            {comment.name} · {comment.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {comment.body}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};
