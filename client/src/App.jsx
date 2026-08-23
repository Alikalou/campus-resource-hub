import { Route, Routes } from "react-router";

import HomePage from "./pages//HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResourcesPage from "./pages/ResourcesPage/ResourcesPage";
import ResourceDetailsPage from "./pages/ResourceDetailsPage/ResourceDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminResourcesPage from "./pages/AdminResourcesPage/AdminResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/resources"
        element={<ResourcesPage />}
      />

      <Route
        path="/resources/:id"
        element={<ResourceDetailsPage />}
      />

      <Route
        path="/bookings/mine"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={"admin"}>
            <AdminPage />
          </ProtectedRoute>}
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminBookingsPage />
          </ProtectedRoute>}
      />

      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute
            requiredRole="admin"
          >
            <AdminResourcesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}