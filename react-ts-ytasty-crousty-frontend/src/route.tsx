import type { RouteObject } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

export const routes: RouteObject[] = [
    { path: "/carte", element: <ProductList /> },
    { path: "/produit/:id", element: <ProductDetail /> },
];