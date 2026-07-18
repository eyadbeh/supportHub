import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

/**
 * Redux store for SupportHub.
 *
 * Global state is intentionally minimal:
 * - auth: user session, token, authentication status
 *
 * Feature-specific state (tickets, departments, etc.) uses
 * local component state or React Query in the future.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
