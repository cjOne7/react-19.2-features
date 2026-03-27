import { Alert, Box, Button } from "@mui/material";
import React from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Box p={3}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={this.handleReset}>
                  Retry
                </Button>
              }
            >
              {this.state.error?.message ?? "Something went wrong"}
            </Alert>
          </Box>
        )
      );
    }

    return this.props.children;
  }
}
