import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./auth/ProtectedRoute";

// public pages
import BuildingsPage from "./pages/public/BuildingsPage";
import ApartmentsPage from "./pages/public/ApartmentsPage";
import ApartmentDetailsPage from "./pages/public/ApartmentDetailsPage";
import LoginPage from "./pages/public/LoginPage";
import ContactPage from "./pages/public/ContactPage";

// app pages
import AppHomePage from "./pages/app/AppHomePage";
import BuildingsAdminPage from "./pages/app/BuildingsAdminPage";
import ApartmentsAppPage from "./pages/app/ApartmentsAppPage";
import InquiriesAppPage from "./pages/app/InquiriesAppPage";
// import ReservationsAppPage from "./pages/app/ReservationsAppPage"; // uključi ako ti treba

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<BuildingsPage />} />
        <Route path="/buildings/:id" element={<ApartmentsPage />} />
        <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* APP */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AppHomePage />} />

        <Route
          path="buildings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BuildingsAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="apartments"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner"]}>
              <ApartmentsAppPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inquiries"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "staff"]}>
              <InquiriesAppPage />
            </ProtectedRoute>
          }
        />

        {/*
        <Route
          path="reservations"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner"]}>
              <ReservationsAppPage />
            </ProtectedRoute>
          }
        />
        */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
