import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useUsersContext } from "./UsersContext";
import { usersApi } from "@/api/users.api";
import type { User } from "@/types";
import React from "react";

function UserCard({ user, isOptimistic }: { user: User; isOptimistic?: boolean }): React.ReactElement {
  const { removeOptimisticUser, setUsers, startTransition } = useUsersContext();

  const handleDelete = (): void => {
    // Show removal instantly, confirm with API in background
    removeOptimisticUser(user.id);
    startTransition(async () => {
      try {
        await usersApi.delete(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch {
        console.error("Delete failed — optimistic state will revert");
      }
    });
  };

  return (
    <Card
      sx={{
        opacity: isOptimistic ? 0.6 : 1,
        outline: isOptimistic ? "2px dashed" : "none",
        outlineColor: "primary.main",
        transition: "opacity .3s",
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          <PersonIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {user.email}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {user.company.name}
        </Typography>
        {isOptimistic && (
          <Chip
            label="optimistic"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 0.5, fontSize: "0.65rem" }}
          />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Delete user">
          <IconButton size="small" color="error" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export function UsersList() {
  const { optimisticUsers, users } = useUsersContext();
  const optimisticIds = new Set(users.map((u) => u.id));

  return (
    <Grid container spacing={2}>
      {optimisticUsers.map((user) => (
        <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <UserCard user={user} isOptimistic={!optimisticIds.has(user.id)} />
        </Grid>
      ))}
    </Grid>
  );
}
