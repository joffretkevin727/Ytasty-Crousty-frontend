export type Category = "chicken" | "side" | "vegetarian" | "menu" | "dessert" | "drink";

export interface Product {
    id: number;
    name: string;
    description: string;
    image?: string;
    price: number;
    category: Category;
    ingredients: string[];
    is_available: boolean;
    restaurant_id: number;
}

export interface ProductFilters {
    restaurant_id?: number;
    category?: Category;
    q?: string;
    is_available?: boolean;
}

export interface ProductPayload {
    name: string;
    description: string;
    category: Category;
    price: number;
    ingredients: string[];
    image?: string;
    restaurant_id: number;
    is_available?: boolean;
}