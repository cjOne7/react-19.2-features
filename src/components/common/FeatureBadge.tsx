import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import React, { type ReactElement } from "react";

interface FeatureBadgeProps {
  label: string;
  description?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "info" | "error";
}

// Single Responsibility: purely renders a "feature in use" indicator
export const FeatureBadge: React.FC<FeatureBadgeProps> = ({ label, description, color = "primary" }): ReactElement => {
  const chip = (
    <Chip
      icon={<AutoAwesomeIcon sx={{ fontSize: "0.85rem !important" }} />}
      label={label}
      color={color}
      size="small"
      variant="outlined"
      sx={{ fontSize: "0.7rem", fontFamily: "monospace" }}
    />
  );

  return description ? (
    <Tooltip title={description} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  );
};
