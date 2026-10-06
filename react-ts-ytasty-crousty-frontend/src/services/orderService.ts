import api from "./api";
import type {
  KitchenOrder,
  OrderStatus,
  ProductSummary,
  RestaurantSummary,
} from "../types/orders";

export async function getRestaurants(): Promise<RestaurantSummary[]> {
  const response = await api.get<RestaurantSummary[]>("/restaurants");
  return response.data;
}

export async function getRestaurant(
  restaurantId: number
): Promise<RestaurantSummary> {
  const response = await api.get<RestaurantSummary>(`/restaurants/${restaurantId}`);
  return response.data;
}

export async function getRestaurantOrders(
  restaurantId: number
): Promise<KitchenOrder[]> {
  const response = await api.get<KitchenOrder[]>(
    `/restaurants/${restaurantId}/orders`
  );
  return response.data;
}

export async function getRestaurantProducts(
  restaurantId: number
): Promise<ProductSummary[]> {
  const response = await api.get<ProductSummary[]>("/products", {
    params: { restaurant_id: restaurantId },
  });
  return response.data;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<KitchenOrder> {
  const response = await api.patch<KitchenOrder>(
    `/orders/${encodeURIComponent(orderNumber)}/status`,
    { status }
  );
  return response.data;
}

export async function cancelOrder(orderNumber: string): Promise<KitchenOrder> {
  const response = await api.post<KitchenOrder>(
    `/orders/${encodeURIComponent(orderNumber)}/cancel`
  );
  return response.data;
}