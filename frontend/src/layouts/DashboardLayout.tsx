// src/layouts/DashboardLayout.tsx
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "#f5f6fa" }}>
          <Outlet /> {/* Render các trang con */}
        </Box>
      </Box>
    </Box>
  );
}
