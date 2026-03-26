import React, { useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormSubmitButton } from "@/features/users/FormSubmitButton";

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export function AddTodoForm({ onAdd }: Props): React.ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

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
}
