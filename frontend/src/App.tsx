// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
// import các page con khác ở đây...

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard layout cho sau khi đăng nhập */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Các route con khác */}
          {/* <Route path="shift" element={<ShiftPage />} /> */}
          {/* <Route path="users" element={<UsersPage />} /> */}
        </Route>

        {/* Nếu user truy cập URL không đúng, tự động chuyển về dashboard hoặc login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
