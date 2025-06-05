// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";

import { ProtectedRoute } from "./components/ProtectedRoute";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";

// App chính
export default function App() {
  const { logout } = useAuth();

  // Logout nếu người dùng đóng trình duyệt hoặc tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      logout(); // Xóa session và chuyển về login
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [logout]);

  // Logout nếu không hoạt động trong 10 phút
  useInactivityLogout(10 * 60 * 1000); // hoặc điều chỉnh thời gian theo nhu cầu

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard layout được bảo vệ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {/* Các route con khác */}
          {/* <Route path="shift" element={<ShiftPage />} /> */}
          {/* <Route path="users" element={<UsersPage />} /> */}
        </Route>

        {/* Route fallback nếu không đúng */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
