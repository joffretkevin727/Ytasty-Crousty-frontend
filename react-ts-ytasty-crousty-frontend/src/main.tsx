import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {  CssBaseline } from "@mui/material";
import { store } from "./store/store";
import { routes } from "./route";
import "./index.css";


const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <CssBaseline />
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);