import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f6fa"
      }}
    >
      <Sidebar />
      <Box 
        sx={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%"
        }}
      >
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flex: 1,
            overflow: "auto",
            position: "relative"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
