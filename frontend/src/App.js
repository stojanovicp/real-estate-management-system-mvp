import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// postojeće public stranice
import BuildingsPage from "./pages/BuildingsPage";
import ApartmentsPage from "./pages/ApartmentsPage";
import ApartmentDetailsPage from "./pages/ApartmentDetailsPage";

// nove stranice (napravićemo ih odmah posle)
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";

// app (interno)
import AppHomePage from "./pages/app/AppHomePage";
import BuildingsAdminPage from "./pages/app/BuildingsAdminPage";
import ApartmentsAppPage from "./pages/app/ApartmentsAppPage";
import InquiriesAppPage from "./pages/app/InquiriesAppPage";

// layout + guard (napravićemo ih odmah posle)
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<BuildingsPage />} />
          <Route path="/buildings/:id" element={<ApartmentsPage />} />
          <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* APP (zaštićeno) */}
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
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
