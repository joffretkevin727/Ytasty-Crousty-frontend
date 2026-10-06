export type OrderStatus =
  | "pending"
  | "validated"
  | "preparing"
  | "ready"
  | "collected"
  | "cancelled";

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface KitchenOrder {
  order_number: string;
  restaurant_id: number;
  created_at: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  pickup_mode: "onsite" | "takeaway";
  customer: {
    name: string;
    email: string;
  };
}

export interface RestaurantSummary {
  id: number;
  name: string;
  city: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  restaurant_id: number;
}