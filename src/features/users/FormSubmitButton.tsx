import React, { type ReactElement } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useFormStatus } from "react-dom";

interface FormSubmitButtonProps {
  children: React.ReactNode;
}

// useFormStatus: reads the nearest parent <form>'s submission state
// This component MUST be a child of a <form> element — not the form itself.
// No props needed — it subscribes to form context automatically.
export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ children }): ReactElement => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      disabled={pending}
      startIcon={pending ? <CircularProgress size={14} color="inherit" /> : null}
      sx={{ whiteSpace: "nowrap", alignSelf: "flex-end", mb: "1px" }}
    >
      {pending ? "Saving…" : children}
    </Button>
  );
};
