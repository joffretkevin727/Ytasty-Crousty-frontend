import api from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export interface CreateUserRequest {
  username: string;
  password: string;
  role: "staff" | "admin";
}

export const createUserRequest = async (
  user: CreateUserRequest
): Promise<void> => {
  await api.post("/users", user);
};