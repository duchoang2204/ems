// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { login as loginAPI } from "../api/authApi";
import { checkShift } from "../api/shiftApi";
import { useAuth } from "../context/AuthContext";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "../features/settings/SettingsDialog";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";


const LoginPage: React.FC = () => {
  const auth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [manv, setManv] = useState("");
  const [mkhau, setMkhau] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const g_mabc = localStorage.getItem("g_mabc") || "100916";
  const getDbFullName = (mabc: string) => {
    switch (mabc) {
      case "100916": return "Hà Nội KT Liên Tỉnh";
      case "101000": return "Hà Nội KT Nội Tỉnh";
      default: return "";
    }
  };

  useEffect(() => {
    console.log('LoginPage mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gọi song song login và check shift
      const [loginRes, shiftRes] = await Promise.all([
        loginAPI(g_mabc, Number(manv), mkhau),
        checkShift(g_mabc)
      ]);

      // Xử lý kết quả login
      const userData = loginRes.data as {
        user: { tennv: string; mucdo: number };
        token: string;
      };

      // Xử lý kết quả shift
      if (!shiftRes || !shiftRes.ok || !shiftRes.shift) {
        setError(shiftRes?.msg || "Ca làm việc hiện tại không hợp lệ hoặc không có dữ liệu ca.");
        setLoading(false);
        console.log('Lỗi ca làm việc:', shiftRes?.msg);
        return;
      }

      const dbKey = g_mabc.startsWith("1009") ? "HNLT" : "HNNT";

      console.log('Gọi auth.login với token:', userData.token);
      auth.login({
        username: userData.user.tennv,
        role: userData.user.mucdo,
        token: userData.token,
        ca: shiftRes.shift.ca,
        ngaykt: String(shiftRes.shift.ngayBatDau),
        db: dbKey,
        mabc: g_mabc
      });
      console.log('Đã gọi xong auth.login');
    } catch (err: any) {
      // Xác định lỗi là do login hay shift
      if (err?.response?.data?.code === 'INVALID_CREDENTIALS') {
        setError('Mã nhân viên hoặc mật khẩu không chính xác!');
      } else if (err?.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError(`Lỗi: ${err?.message || err.toString()}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #2196f3 0%, #1976d2 100%)",
        py: 3,
        overflow: "hidden"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            position: "relative"
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Tooltip title="Cài đặt hệ thống">
              <IconButton 
                onClick={() => setSettingsOpen(true)}
                sx={{ 
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected" }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              sx={{ 
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2
              }}
            >
              Đăng nhập hệ thống
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                color: "text.secondary",
                fontWeight: "medium",
                fontSize: isMobile ? "1rem" : "1.25rem"
              }}
            >
              Bạn đang làm việc tại {getDbFullName(g_mabc)}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Mã nhân viên"
              value={manv}
              onChange={(e) => setManv(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              autoComplete="postal-code-manv"
              name="manv"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={mkhau}
              onChange={(e) => setMkhau(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              name="mkhau"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2, 
                  bgcolor: "error.main", 
                  color: "white",
                  p: 1,
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  textAlign: "center"
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow: 8,
                "&:hover": {
                  boxShadow: 12,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default LoginPage;
