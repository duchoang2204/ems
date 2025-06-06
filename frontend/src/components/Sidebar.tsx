// src/components/Sidebar.tsx
import { useState } from "react";
import { 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Toolbar,
  IconButton,
  useTheme
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useLocation } from "react-router-dom";
// Nếu phân quyền: import { useSelector } from "react-redux";

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 65;

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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        if (!open) setOpen(false);
      }}
      sx={{
        width: open || isHovering ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
        flexShrink: 0,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [`& .MuiDrawer-paper`]: {
          width: open || isHovering ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menu.map(item => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open || isHovering ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open || isHovering ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open || isHovering ? 1 : 0,
                  transition: theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.enteringScreen,
                  })
                }} 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
