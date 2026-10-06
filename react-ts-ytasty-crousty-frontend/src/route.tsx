import type { RouteObject } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking.tsx";

export const routes: RouteObject[] = [
    { path: "/carte", element: <ProductList /> },
    { path: "/produit/:id", element: <ProductDetail /> },
    { path: "/panier", element: <Cart /> },
    { path: "/commande", element: <Checkout /> },
    { path: "/confirmation/:order_number", element: <OrderConfirmation /> },
    { path: "/suivi", element: <OrderTracking /> },
    { path: "/suivi/:order_number", element: <OrderTracking /> },
];