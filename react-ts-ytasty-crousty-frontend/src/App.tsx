import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

import Header from "./components/Header";
import RestaurantList from "./components/RestaurantList";
import Login from "./pages/Login";
import { CreateUserPage } from "./pages/CreateUserPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import type { RootState } from "./store/store";

const cityByRestaurantId: Record<number, string> = {
  1: "Aix-en-Provence",
  2: "Lyon",
  3: "Paris",
  4: "Marseille",
  5: "Toulouse",
  6: "Bordeaux",
  7: "Lille",
  8: "Nice",
  9: "Nantes",
  10: "Montpellier",
};

const restaurantIdByCity: Record<string, number> = {
  "Aix-en-Provence": 1,
  Lyon: 2,
  Paris: 3,
  Marseille: 4,
  Toulouse: 5,
  Bordeaux: 6,
  Lille: 7,
  Nice: 8,
  Nantes: 9,
  Montpellier: 10,
};

function PublicLayout() {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const queryRestaurantId = Number(
    new URLSearchParams(location.search).get("restaurant_id")
  );
  const activeRestaurant = cityByRestaurantId[queryRestaurantId] ?? "Aix-en-Provence";

  const setActiveRestaurant = (city: string) => {
    const restaurantId = restaurantIdByCity[city];
    if (restaurantId) navigate(`/carte?restaurant_id=${restaurantId}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header
        activeRestaurant={activeRestaurant}
        setActiveRestaurant={setActiveRestaurant}
        cartCount={cartCount}
      />
      <Outlet />
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/carte" element={<ProductList />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/commande" element={<Checkout />} />
        <Route path="/confirmation/:order_number" element={<OrderConfirmation />} />
        <Route path="/suivi" element={<OrderTracking />} />
        <Route path="/suivi/:order_number" element={<OrderTracking />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<KitchenDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<CreateUserPage />} />
      </Route>
    </Routes>
  );
}

export default App;
