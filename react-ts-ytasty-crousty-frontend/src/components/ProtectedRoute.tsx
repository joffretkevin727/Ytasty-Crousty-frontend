import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import type { UserRole } from "../types/auth";
import { logout } from "../store/reducers/authSlice";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Pas connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Connecté mais rôle non autorisé
  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
            Ytasty Crousty <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>| Espace pro</Box>
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Se déconnecter
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}