import api from "./api"
import type { Product, ProductFilters, ProductPayload } from "../type/product"

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

// si l'API attend d'autres noms de champs, c'est ici et dans ProductPayload qu'il faut changer

export const updateAvailability = async (id: number, is_available: boolean): Promise<void> => {
    await api.patch(`/products/${id}/availability`, { is_available });
};

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
};

export const updateProduct = async (id: number, payload: ProductPayload): Promise<Product> => {
    const { data } = await api.patch<Product>(`/products/${id}`, payload);
    return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
};