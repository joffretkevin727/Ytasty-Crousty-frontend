export type UserRole = "staff" | "admin";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AuthUser {
  username: string;
  role: UserRole;
  restaurantId: number | null;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  restaurant_id: number | null;
}