// Assemble auth et panier; le panier est restauré puis sauvegardé dans localStorage.
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import cartReducer, { type CartItem } from "./reducer/cart";

interface PersistedCart {
  items: CartItem[];
}

const getPersistedCart = (): PersistedCart | undefined => {
  const saved = localStorage.getItem("cart");
  if (!saved) return undefined;

  try {
    // N'accepte qu'un objet contenant un tableau items avant de l'utiliser comme état.
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "items" in parsed &&
      Array.isArray(parsed.items)
    ) {
      return { items: parsed.items as CartItem[] };
    }
  } catch {
    localStorage.removeItem("cart");
  }

  return undefined;
};

const persistedCart = getPersistedCart();
const persistedCartReducer = (
  state: ReturnType<typeof cartReducer> | undefined,
  action: Parameters<typeof cartReducer>[1]
) => cartReducer(state ?? persistedCart, action);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: persistedCartReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem("cart", JSON.stringify(store.getState().cart));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
