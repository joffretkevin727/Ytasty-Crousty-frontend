// Contrats API des commandes, produits et restaurants employés par le module cuisine.
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
  address?: string;
  is_open?: boolean;
  opening_hours?: string;
  contact?: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  restaurant_id: number;
}