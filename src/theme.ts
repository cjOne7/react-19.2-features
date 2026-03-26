import { extendTheme } from "@mui/material/styles";

// MUI v7: CSS Variables theming via extendTheme + ThemeProvider
export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#6366f1" },
        secondary: { main: "#ec4899" },
        success: { main: "#22c55e" },
        background: { default: "#f1f5f9", paper: "#ffffff" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#818cf8" },
        secondary: { main: "#f472b6" },
        success: { main: "#4ade80" },
        background: { default: "#0f172a", paper: "#1e293b" },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          borderRadius: 14,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "monospace", fontWeight: 600 },
      },
    },
  },
});
