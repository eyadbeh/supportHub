import { Routes, Route, Navigate } from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

/**
 * Root application component.
 *
 * Routes will be organized by Sprint:
 *   Sprint 1: /login, /register
 *   Sprint 2: /admin/departments, /admin/categories, /admin/statuses
 *   Sprint 3: /dashboard, /tickets/new, /tickets/:id
 *   Sprint 5: /admin/dashboard, /admin/reports
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Guest Routes (Only unauthenticated users) */}
      <Route element={<GuestRoute />}>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected Routes (Authenticated users only) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
              <div className="text-center">
                <h1 className="mb-2 text-4xl font-bold text-white">
                  Dashboard Placeholder
                </h1>
                <p className="text-lg text-slate-400">
                  Sprint 1 — Auth Flow Complete
                </p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  Temporary Logout
                </button>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
