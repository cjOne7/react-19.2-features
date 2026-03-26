import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import React from "react";

interface Props {
  label: string;
  description?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "info" | "error";
}

// Single Responsibility: purely renders a "feature in use" indicator
export function FeatureBadge({ label, description, color = "primary" }: Props): React.ReactElement {
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
}
