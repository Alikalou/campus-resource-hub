import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetailsPage from "./pages/ResourceDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminResourcesPage from "./pages/AdminResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/resources"
        element={<ResourcesPage />}
      />

      <Route
        path="/resources/:id"
        element={<ResourceDetailsPage />}
      />

      <Route
        path="/bookings"
        element={<MyBookingsPage />}
      />

      <Route
        path="/admin/bookings"
        element={<AdminBookingsPage />}
      />

      <Route
        path="/admin/resources"
        element={<AdminResourcesPage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}