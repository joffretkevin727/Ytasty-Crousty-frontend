import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./reducer/cart"

// on récupère le panier sauvegardé (s'il existe)
const saved = localStorage.getItem("cart");

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState: saved ? { cart: JSON.parse(saved) } : undefined,
});

// à chaque changement on sauvegarde le panier
store.subscribe(() => {
    localStorage.setItem("cart", JSON.stringify(store.getState().cart));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch