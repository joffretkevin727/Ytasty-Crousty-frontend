// Gère la session auth et la persistance du JWT et du profil utilisateur.
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/auth";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  // Au redémarrage, restaure uniquement une session dont le profil est exploitable.
  const accessToken = localStorage.getItem("access_token");

  try {
    const storedUser = localStorage.getItem("auth_user");
    const user = storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
    const validRole = user && ["staff", "admin"].includes(user.role);

    if (accessToken && user && validRole) {
      return { accessToken, user, isAuthenticated: true };
    }
  } catch {
    localStorage.removeItem("auth_user");
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");
  return { accessToken: null, user: null, isAuthenticated: false };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: AuthUser;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem(
        "access_token",
        action.payload.accessToken
      );

      localStorage.setItem(
        "auth_user",
        JSON.stringify(action.payload.user)
      );
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;