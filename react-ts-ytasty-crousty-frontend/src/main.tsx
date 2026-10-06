import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App";
import { store } from "./store/store";

import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { light: "#d87556", main: "#b43f24", dark: "#8d2e19", contrastText: "#ffffff" },
    secondary: { light: "#5b866d", main: "#315f48", dark: "#244634", contrastText: "#ffffff" },
    success: { main: "#347a53", dark: "#245c3c" },
    warning: { main: "#c88727", dark: "#8a5c13" },
    error: { main: "#b43f24", dark: "#8d2e19" },
    background: { default: "#fffaf3", paper: "#ffffff" },
    text: { primary: "#302822", secondary: "#706258" },
    divider: "#e8ddd3",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 750 },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 44,
          boxShadow: "none",
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 4px 12px rgba(141, 46, 25, 0.16)",
            "&:hover": { boxShadow: "0 6px 16px rgba(141, 46, 25, 0.22)" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", borderRadius: 12 },
        elevation6: {
          border: "1px solid #f0e5db",
          boxShadow: "0 18px 44px rgba(48, 40, 34, 0.12)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d9cec4" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b43f24" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 2 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: "#706258", "&.Mui-focused": { color: "#8d2e19" } },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#302822",
          backgroundColor: "#fffdf9",
          borderBottom: "1px solid #e8ddd3",
        },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } },
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);