import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import { CreateUserPage } from "./pages/CreateUserPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return <h1>Accueil Ytasty Crousty</h1>;
}

function Dashboard() {
  return <KitchenDashboard />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >
        <Route
          path="/admin"
          element={<Navigate to="/admin/users" replace />}
        />
        <Route
          path="/admin/users"
          element={<CreateUserPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;