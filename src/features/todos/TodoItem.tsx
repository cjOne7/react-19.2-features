import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Card, CardContent, Checkbox, IconButton, Typography } from "@mui/material";
import React, { type ReactElement } from "react";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }): ReactElement => {
  return (
    <Card variant="outlined">
      <CardContent sx={{ py: "8px !important", display: "flex", alignItems: "center", gap: 1 }}>
        <Checkbox checked={todo.completed} onChange={(event) => onToggle(todo.id, event.target.checked)} size="small" />
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "text.disabled" : "text.primary",
          }}
        >
          {todo.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton size="small" color="error" onClick={() => onDelete(todo.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
