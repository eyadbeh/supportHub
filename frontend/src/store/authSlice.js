import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth slice manages the authenticated user session.
 *
 * State shape:
 *   user: object | null     — the current authenticated user
 *   token: string | null    — Sanctum Bearer token
 *   loading: boolean        — whether auth operations are in progress
 *   authenticated: boolean  — derived from user + token presence
 */
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  authenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authenticated = true;
      state.loading = false;
      localStorage.setItem("token", action.payload.token);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.authenticated = true;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.authenticated = false;
      state.loading = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.authenticated;
export const selectAuthLoading = (state) => state.auth.loading;
