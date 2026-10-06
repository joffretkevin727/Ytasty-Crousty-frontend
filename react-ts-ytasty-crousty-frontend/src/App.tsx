import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";

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

function PublicLayout() {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar sx={{ maxWidth: 1440, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}>
          <Typography
            component={Link}
            to="/carte"
            variant="h6"
            sx={{ flexGrow: 1, color: "primary.main", fontWeight: 900, textDecoration: "none" }}
          >
            Ytasty Crousty
          </Typography>
          <Button component={Link} to="/carte" color="inherit">
            La carte
          </Button>
          <Tooltip title="Ouvrir le panier">
            <IconButton component={Link} to="/panier" aria-label={`Panier, ${cartCount} article${cartCount === 1 ? "" : "s"}`} color="primary">
              <Badge badgeContent={cartCount} color="secondary" max={99}>
                <ShoppingBagOutlined />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}

function Dashboard() {
  return <KitchenDashboard />;
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/carte" replace />} />
        <Route path="/carte" element={<ProductList />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/commande" element={<Checkout />} />
        <Route path="/confirmation/:order_number" element={<OrderConfirmation />} />
        <Route path="/suivi" element={<OrderTracking />} />
        <Route path="/suivi/:order_number" element={<OrderTracking />} />
      </Route>

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