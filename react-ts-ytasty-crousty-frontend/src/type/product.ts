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