// src/components/Sidebar.tsx
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate, useLocation } from "react-router-dom";
// Nếu phân quyền: import { useSelector } from "react-redux";

const menu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Ca làm việc", icon: <TimelineIcon />, path: "/shift" },
  { text: "Người dùng", icon: <PeopleIcon />, path: "/users" },
  { text: "Cài đặt", icon: <SettingsIcon />, path: "/settings" },
  // Tuỳ theo phân quyền, render thêm/bớt menu
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menu.map(item => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
