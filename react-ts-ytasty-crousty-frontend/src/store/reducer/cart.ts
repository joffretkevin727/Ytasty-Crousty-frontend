import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../type/product";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<Product>) {
            const existing = state.items.find((i) => i.product.id === action.payload.id);
            if (existing) existing.quantity += 1;
            else state.items.push({ product: action.payload, quantity: 1});
        },
        incrementItem(state, action: PayloadAction<number>) {
            const item = state.items.find((i) => i.product.id === action.payload);
            if (item) item.quantity += 1;
        },
        decrementItem(state, action: PayloadAction<number>) {
            const item = state.items.find((i) => i.product.id === action.payload);
            if (!item) return;
            item.quantity -= 1;
            if (item.quantity <= 0) {
                state.items = state.items.filter((i) => i.product.id !== action.payload);
            }
        },
        removeItem(state, action: PayloadAction<number>) {
            state.items = state.items.filter((i) => i.product.id !== action.payload)
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addItem, decrementItem, removeItem, clearCart, incrementItem } = cartSlice.actions;
export default cartSlice.reducer;