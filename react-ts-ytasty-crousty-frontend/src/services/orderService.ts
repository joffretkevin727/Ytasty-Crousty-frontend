import api from "./api"
import type { CreateOrderPayload, Order } from "../type/order"
import type {
    KitchenOrder,
    OrderStatus,
    ProductSummary,
    RestaurantSummary,
} from "../types/orders";

// si l'API attend d'autres noms de champs, c'est ici (et dans type/order.ts) qu'il faut les changer
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
};

export const fetchOrder = async (orderNumber: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${orderNumber}`);
    return data;
};

export const getRestaurants = async (): Promise<RestaurantSummary[]> => {
    const { data } = await api.get<RestaurantSummary[]>("/restaurants");
    return data;
};

export const getRestaurant = async (restaurantId: number): Promise<RestaurantSummary> => {
    const { data } = await api.get<RestaurantSummary>(`/restaurants/${restaurantId}`);
    return data;
};

export const getRestaurantOrders = async (restaurantId: number): Promise<KitchenOrder[]> => {
    const { data } = await api.get<KitchenOrder[]>(`/restaurants/${restaurantId}/orders`);
    return data;
};

export const getRestaurantProducts = async (restaurantId: number): Promise<ProductSummary[]> => {
    const { data } = await api.get<ProductSummary[]>("/products", {
        params: { restaurant_id: restaurantId },
    });
    return data;
};

export const updateOrderStatus = async (
    orderNumber: string,
    status: OrderStatus,
): Promise<KitchenOrder> => {
    const { data } = await api.patch<KitchenOrder>(
        `/orders/${encodeURIComponent(orderNumber)}/status`,
        { status },
    );
    return data;
};

export const cancelOrder = async (orderNumber: string): Promise<KitchenOrder> => {
    const { data } = await api.post<KitchenOrder>(
        `/orders/${encodeURIComponent(orderNumber)}/cancel`,
    );
    return data;
};
