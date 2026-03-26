import React, { useActionState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { FormSubmitButton } from "./FormSubmitButton";
import { usersApi } from "@/api/users.api";
import { useUsersContext } from "./UsersContext";
import type { AddUserFormState, User } from "@/types";

const INITIAL_STATE: AddUserFormState = { status: "idle", message: "", user: null };

export function AddUserForm(): React.ReactElement {
  const { addOptimisticUser, setUsers } = useUsersContext();

  // useActionState: manages the full async form lifecycle
  // [state, formAction, isPending] — isPending is true while the async action runs
  const [state, formAction] = useActionState(
    async (_prev: AddUserFormState, formData: FormData): Promise<AddUserFormState> => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;

      const optimisticUser: User = {
        id: Date.now(), // temp id
        name,
        email,
        username: name.toLowerCase().replace(/\s+/g, "."),
        phone: "",
        website: "",
        address: { street: "", suite: "", city: "", zipcode: "" },
        company: { name: "" },
      };

      // Immediately reflect in UI before API responds
      addOptimisticUser(optimisticUser);

      try {
        const created = await usersApi.create(optimisticUser);
        // Commit the real server user
        setUsers((prev) => [...prev, { ...created, id: optimisticUser.id }]);
        return { status: "success", message: `✅ "${name}" added!`, user: created };
      } catch {
        return { status: "error", message: "❌ Failed to add user. Try again.", user: null };
      }
    },
    INITIAL_STATE,
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Add New User
        </Typography>

        {/* React 19: <form action={asyncFn}> — native async form handling */}
        <form action={formAction}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
            <TextField name="name" label="Full Name" required size="small" sx={{ flex: 1 }} />
            <TextField name="email" label="Email Address" required size="small" type="email" sx={{ flex: 1 }} />
            <FormSubmitButton>Add User</FormSubmitButton>
          </Stack>
        </form>

        {state.status !== "idle" && (
          <Alert severity={state.status === "success" ? "success" : "error"} sx={{ mt: 2 }}>
            {state.message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
