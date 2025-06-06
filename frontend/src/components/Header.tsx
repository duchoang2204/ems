// src/components/Header.tsx
import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const getDbName = (mabc: string) => {
    switch (mabc) {
      case "100916": return "Hà Nội KT Liên Tỉnh";
      case "101000": return "Hà Nội KT Nội Tỉnh";
      default: return "";
    }
  };

  return (
    <AppBar 
      position="static" 
      color="primary" 
      sx={{ 
        height: 64, 
        justifyContent: "center", 
        zIndex: 1201,
        boxShadow: 3
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
            Hệ thống EMS
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
            {getDbName(user?.mabc || "")}
          </Typography>

          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ padding: 0 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: "primary.dark",
                  border: '2px solid white'
                }}
              >
                {user?.username?.[0] || "?"}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 4,
            sx: {
              width: 220,
              overflow: 'visible',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" noWrap>{user?.username}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.role === 9 ? "Admin" : "Người dùng"}
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Thông tin cá nhân
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            Trạng thái
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <VpnKeyIcon fontSize="small" />
            </ListItemIcon>
            Đổi mật khẩu
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Đăng xuất</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
