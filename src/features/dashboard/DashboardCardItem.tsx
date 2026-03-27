import React, { type ReactElement } from "react";
import { Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";

import type { Feature } from "@/types";

interface DashboardCardItemProps {
  feature: Feature;
}

export const DashboardCardItem: React.FC<DashboardCardItemProps> = ({ feature }): ReactElement => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card
        sx={{
          height: "100%",
          borderTop: `4px solid ${feature.color}`,
          transition: "transform .15s",
          "&:hover": { transform: "translateY(-2px)" }
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
                alignSelf: "flex-start"
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
  );
};
