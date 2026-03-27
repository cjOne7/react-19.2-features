import React, { type ReactElement, useRef } from "react";
import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { FormSubmitButton } from "@/features/users/FormSubmitButton";

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }): ReactElement => {
  const formRef = useRef<HTMLFormElement | null>(null);

  // Native async form action — useFormStatus in FormSubmitButton
  // reads this form's pending state automatically
  const formAction = async (formData: FormData): Promise<void> => {
    const title = (formData.get("title") as string).trim();
    if (!title) return;
    await onAdd(title);
    formRef.current?.reset();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" mb={1.5}>
          New Todo
        </Typography>
        {/* action={asyncFn} — React 19 native async form action */}
        <form ref={formRef} action={formAction}>
          <Stack direction="row" spacing={1}>
            <TextField
              name="title"
              placeholder="What needs to be done?"
              size="small"
              required
              fullWidth
              autoComplete="off"
            />
            {/* useFormStatus inside FormSubmitButton reads THIS form's pending state */}
            <FormSubmitButton>Add</FormSubmitButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
