import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Todo } from "@/types";
import React from "react";

interface Props {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props): React.ReactElement {
  return (
    <Card variant="outlined">
      <CardContent sx={{ py: "8px !important", display: "flex", alignItems: "center", gap: 1 }}>
        <Checkbox checked={todo.completed} onChange={(e) => onToggle(todo.id, e.target.checked)} size="small" />
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
}
