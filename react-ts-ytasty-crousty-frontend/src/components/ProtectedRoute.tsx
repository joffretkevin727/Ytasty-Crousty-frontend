// Bloque les routes privées selon l'état d'authentification et les rôles autorisés.
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
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

  return <Outlet />;
}