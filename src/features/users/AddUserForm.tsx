import React, { type ReactElement, useActionState } from "react";
import { Alert, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { usersApi } from "@/api/users.api";
import type { AddUserFormState, User } from "@/types";
import { FormSubmitButton } from "./FormSubmitButton";
import { useUsersContext } from "./UsersContext";

const INITIAL_STATE: AddUserFormState = { status: "idle", message: "", user: null };

export const AddUserForm: React.FC = (): ReactElement => {
  const { addOptimisticUser, setUsers } = useUsersContext();

  // useActionState: manages the full async form lifecycle
  // [state, formAction, isPending] — isPending is true while the async action runs
  const [state, formAction] = useActionState<AddUserFormState, FormData>(
    async (_previousState: AddUserFormState, formData: FormData): Promise<AddUserFormState> => {
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
        const createdUser = await usersApi.create(optimisticUser);
        // Commit the real server user
        setUsers((previousUsers) => [...previousUsers, { ...createdUser, id: optimisticUser.id }]);
        return { status: "success", message: `✅ "${name}" added!`, user: createdUser };
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
};
