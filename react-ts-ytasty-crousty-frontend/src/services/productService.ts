import api from "./api"
import type { Product, ProductFilters } from "../type/product"

export const fetchProducts = async (filters: ProductFilters): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products", { params: filters });
    return data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
};

// les images sont servies par l'API, on ajoute le préfixe du proxy
export const imageUrl = (path: string) => `${import.meta.env.VITE_API_URL}${path}`;