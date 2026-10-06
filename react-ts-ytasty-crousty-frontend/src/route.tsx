import type { RouteObject } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import ManageMenu from "./pages/ManageMenu";

export const routes: RouteObject[] = [
    { path: "/carte", element: <ProductList /> },
    { path: "/produit/:id", element: <ProductDetail /> },
    { path: "/panier", element: <Cart /> },
    { path: "/gestion-carte", element: <ManageMenu /> },
];