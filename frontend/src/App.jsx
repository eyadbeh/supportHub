import { Routes, Route, Navigate } from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";
import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import SupportLayout from "@/layouts/SupportLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminTicketsPage from "@/features/admin/pages/AdminTicketsPage";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage";
import DepartmentsPage from "@/features/admin/pages/DepartmentsPage";
import CategoriesPage from "@/features/admin/pages/CategoriesPage";
import StatusesPage from "@/features/admin/pages/StatusesPage";

import ProfilePage from "@/features/profile/pages/ProfilePage";

import TicketsListPage from "@/features/tickets/pages/TicketsListPage";
import CreateTicketPage from "@/features/tickets/pages/CreateTicketPage";
import TicketDetailsPage from "@/features/tickets/pages/TicketDetailsPage";

import ThemeToggle from "@/components/ThemeToggle";

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
    <>
      <ThemeToggle />
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
          {/* Shared User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets" element={<TicketsListPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Support Agent Routes */}
          <Route element={<RoleRoute allowedRoles={['Support']} />}>
            <Route path="/support" element={<SupportLayout />}>
              <Route index element={<TicketsListPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
          
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="statuses" element={<StatusesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
