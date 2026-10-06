import api from "./api"
import type { CreateOrderPayload, Order } from "../type/order"

// si l'API attend d'autres noms de champs, c'est ici (et dans type/order.ts) qu'il faut les changer
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
};

export const fetchOrder = async (orderNumber: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${orderNumber}`);
    return data;
};