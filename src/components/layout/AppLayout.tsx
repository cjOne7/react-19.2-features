import { useColorScheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { type ReactNode } from "react";
import type { TabId } from "@/types";

interface Props {
  activeTab: TabId;
  isPending: boolean;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "posts", label: "Posts", icon: <ArticleIcon /> },
  { id: "users", label: "Users", icon: <PeopleIcon /> },
  { id: "todos", label: "Todos", icon: <CheckBoxIcon /> },
];

// MUI v7: useColorScheme works with CssVarsProvider for instant theme switching
function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton color="inherit" onClick={() => setMode(mode === "light" ? "dark" : "light")} title="Toggle theme">
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

export function AppLayout({ activeTab, isPending, onTabChange, children }: Props): React.ReactElement {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 0, mr: 3 }}>
            ⚛️ React 19
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(_, v: TabId) => onTabChange(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flexGrow: 1, opacity: isPending ? 0.6 : 1, transition: "opacity .2s" }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={tab.icon as React.ReactElement}
                iconPosition="start"
                sx={{ minHeight: 64, textTransform: "none", fontWeight: 600 }}
              />
            ))}
          </Tabs>

          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
