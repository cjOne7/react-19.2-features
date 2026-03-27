import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import React, { type ReactElement } from "react";
import { usePageAnalytics } from "@/hooks/useAnalytics";

const FEATURES = [
  {
    hook: "use()",
    page: "Posts",
    color: "#6366f1" as const,
    description: "Read Promises & Context directly in render. Pairs with Suspense for seamless async UI.",
  },
  {
    hook: "useTransition",
    page: "Navigation",
    color: "#8b5cf6" as const,
    description: "Tab switching never blocks the UI. isPending drives the AppBar opacity.",
  },
  {
    hook: "useFormStatus",
    page: "Todos / Users",
    color: "#ec4899" as const,
    description: "FormSubmitButton reads its parent <form> pending state — zero prop drilling.",
  },
  {
    hook: "useOptimistic",
    page: "Todos",
    color: "#f59e0b" as const,
    description: "New todos appear instantly; reverted automatically if the API call fails.",
  },
  {
    hook: "useActionState",
    page: "Users",
    color: "#22c55e" as const,
    description: "Async form actions with built-in state machine: idle → pending → success/error.",
  },
  {
    hook: "useEffectEvent",
    page: "All pages",
    color: "#14b8a6" as const,
    description: "Stable analytics callback that always sees the latest props without stale-closure bugs.",
  },
  {
    hook: "<Activity>",
    page: "App Shell",
    color: "#f97316" as const,
    description: "Hidden tabs keep their full React tree alive — state, scroll position, cached data.",
  },
  {
    hook: "<Suspense>",
    page: "Posts / Users",
    color: "#06b6d4" as const,
    description: "Declarative loading boundaries driven by use() and lazy components.",
  },
] as const;

export const DashboardPage: React.FC = (): ReactElement => {
  usePageAnalytics("dashboard");

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        React 19.2 Feature Showcase
      </Typography>
      <Typography color="text.secondary" mb={4}>
        A production-quality SPA demonstrating every major React 19.2 hook and built-in component, connected to the
        JSONPlaceholder REST API with TypeScript 6 strict mode.
      </Typography>

      <Grid container spacing={3}>
        {FEATURES.map((feature) => (
          <Grid key={feature.hook} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: "100%",
                borderTop: `4px solid ${feature.color}`,
                transition: "transform .15s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Chip
                    label={feature.hook}
                    size="small"
                    sx={{
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      alignSelf: "flex-start",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    📍 {feature.page}
                  </Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
