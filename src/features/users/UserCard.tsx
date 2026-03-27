import { Delete as DeleteIcon, Person as PersonIcon } from "@mui/icons-material";
import { Card, CardActions, CardContent, Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { type ReactElement } from "react";
import { usersApi } from "@/api";
import { useUsersContext } from "@/features";
import type { User } from "@/types";

interface UserCardProps {
  user: User;
  isOptimistic?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, isOptimistic }): ReactElement => {
  const { removeOptimisticUser, setUsers, startTransition } = useUsersContext();

  const handleDelete = (): void => {
    // Show removal instantly, confirm with API in background
    removeOptimisticUser(user.id);
    startTransition(async () => {
      try {
        await usersApi.delete(user.id);
        setUsers((previousUsers) => previousUsers.filter((userItem) => userItem.id !== user.id));
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
};

export const UsersList: React.FC = (): ReactElement => {
  const { optimisticUsers, users } = useUsersContext();
  const optimisticIds = new Set<number>(users.map((userItem) => userItem.id));

  return (
    <Grid container spacing={2}>
      {optimisticUsers.map((user) => (
        <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <UserCard user={user} isOptimistic={!optimisticIds.has(user.id)} />
        </Grid>
      ))}
    </Grid>
  );
};
