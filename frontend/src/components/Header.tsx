// src/components/Header.tsx
import { AppBar, Toolbar, Typography, Box, Avatar, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";

import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ height: 56, justifyContent: "center", zIndex: 1201 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
          EMS Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2", mr: 1 }}>
            {user?.tennv?.[0] || "?"}
          </Avatar>
          <Typography sx={{ mr: 2 }}>{user?.tennv || "User"}</Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ ml: 1 }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
