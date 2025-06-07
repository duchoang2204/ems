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
import { usePageTitle } from "../hooks/usePageTitle";

export default function Header() {
  const { userInfo, logout } = useAuth();
  const { pageTitle } = usePageTitle();
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" noWrap>
            Hệ thống EMS
          </Typography>
          {pageTitle && (
            <>
              <Typography variant="h6" sx={{ color: "grey.300" }}>
                |
              </Typography>
              <Typography variant="h6" noWrap>
                {pageTitle}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
            {getDbName(userInfo?.mabc || "")}
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
                {userInfo?.username?.[0] || "?"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={() => navigate('/change-password')}>
              <ListItemIcon>
                <VpnKeyIcon fontSize="small" />
              </ListItemIcon>
              Đổi mật khẩu
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate('/about')}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              Thông tin phiên bản
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
