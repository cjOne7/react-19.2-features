import {
  Article as ArticleIcon,
  CheckBox as CheckBoxIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  LightMode as LightModeIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { AppBar, Box, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import React, { type ReactElement, type ReactNode } from "react";
import type { TabId } from "@/types";

interface AppLayoutProps {
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
const ThemeToggle: React.FC = (): ReactElement => {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton color="inherit" onClick={() => setMode(mode === "light" ? "dark" : "light")} title="Toggle theme">
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ activeTab, isPending, onTabChange, children }): ReactElement => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 0, mr: 3 }}>
            ⚛️ React 19
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(_event, nextTab: TabId) => onTabChange(nextTab)}
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
};
