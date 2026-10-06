import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Tes pages existantes
import Login from "./pages/Login";
import { CreateUserPage } from "./pages/CreateUserPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Nos composants du Module A
import Header from "./components/Header";
import RestaurantList from "./components/RestaurantList";

// On explique à TypeScript à quoi ressemble un utilisateur
interface User {
  name: string;
  role: string;
  avatar: string;
}

function App() {
  // 1. On ramène les états nécessaires pour le Header (AVEC les types TypeScript !)
  const [activeRestaurant, setActiveRestaurant] =
    useState<string>("Aix-en-Provence");
  const [cartCount, setCartCount] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* 2. Le Header est placé HORS des routes : il sera visible sur toutes les pages */}
      <Header
        activeRestaurant={activeRestaurant}
        setActiveRestaurant={setActiveRestaurant}
        cartCount={cartCount}
        user={user}
        setUser={setUser}
      />

      {/* 3. Ton système de navigation */}
      <main>
        <Routes>
          {/* La page d'accueil affiche maintenant notre liste de restaurants */}
          <Route path="/" element={<RestaurantList />} />

          {/* Tes autres routes restent intactes */}
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<KitchenDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/users" replace />}
            />
            <Route path="/admin/users" element={<CreateUserPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
