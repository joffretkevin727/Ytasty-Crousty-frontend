import api from "./api"
import type { Product, ProductFilters } from "../type/product"

export const fetchProducts = async (filters: ProductFilters): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products", {params: filters });
    return data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`products/${id}`);
    return data;
}