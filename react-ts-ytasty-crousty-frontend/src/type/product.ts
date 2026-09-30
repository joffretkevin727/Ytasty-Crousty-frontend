export type Category = "burgers" | "menus" | "accompagnements" | "boissons" | "desserts";

export interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    ingredients: string[];
    image_url?: string;
    is_available: boolean;
    restaurant_id: number;
}

export interface ProductFilters {
    restaurant_id?: number;
    category?: Category;
    q?: string;
    is_available?: boolean;
}