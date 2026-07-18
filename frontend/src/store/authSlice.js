import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth slice manages the authenticated user session.
 *
 * State shape:
 *   user: object | null     — the current authenticated user
 *   loading: boolean        — whether auth operations are in progress
 *   authenticated: boolean  — derived from user presence
 */
const initialState = {
  user: null,
  loading: false,
  authenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.authenticated = true;
      state.loading = false;
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
      state.authenticated = false;
      state.loading = false;
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.authenticated;
export const selectAuthLoading = (state) => state.auth.loading;
