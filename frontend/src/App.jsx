import { Routes, Route } from "react-router-dom";

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
      <Route
        path="/"
        element={
          <div className="flex min-h-screen items-center justify-center bg-slate-950">
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold text-white">
                SupportHub
              </h1>
              <p className="text-lg text-slate-400">
                Helpdesk &amp; Ticket Management System
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Sprint 0 — Project Setup Complete
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
