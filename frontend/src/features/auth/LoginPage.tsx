import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { Button, TextField, Typography, Box, Container, Paper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import type { RootState, AppDispatch } from "../../app/store";
import SettingsDialog from "../settings/SettingsDialog";
import { checkShift } from "../../api/shiftApi";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [manv, setManv] = useState("");
  const [mkhau, setMkhau] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shiftError, setShiftError] = useState<string | null>(null);
  const [shiftLoading, setShiftLoading] = useState(false);
  const g_mabc = localStorage.getItem("g_mabc") || "100916";
  const loading = useSelector((state: RootState) => state.auth.loading);
  const loginError = useSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShiftError(null);
    try {
      // 1. Đăng nhập
      await dispatch(login({ g_mabc, manv: Number(manv), mkhau })).unwrap();
      // 2. Kiểm tra ca (dùng hàm import từ api/shiftApi)
      setShiftLoading(true);
      const res = await checkShift(g_mabc);
      setShiftLoading(false);
      if (res.ok) {
        // TODO: Điều hướng hoặc set state login thành công
        // window.location.href = "/main";
      } else {
        setShiftError(res.msg || "Ca làm việc không hợp lệ!");
      }
    } catch {
      setShiftLoading(false);
      // Không set shiftError ở đây, đã có loginError từ Redux
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            position: 'relative'
          }}
        >
          <Button
            onClick={() => setSettingsOpen(true)}
            startIcon={<SettingsIcon />}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          >
            Settings
          </Button>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Đăng nhập hệ thống nội bộ tổ {g_mabc}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mã nhân viên"
              value={manv}
              onChange={e => setManv(e.target.value)}
              type="number"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type="password"
              value={mkhau}
              onChange={e => setMkhau(e.target.value)}
            />
            {loginError && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {loginError}
              </Typography>
            )}
            {shiftError && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {shiftError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || shiftLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {shiftLoading ? "Đang kiểm tra ca..." : "Đăng nhập"}
            </Button>
          </Box>
        </Paper>
      </Box>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Container>
  );
};

export default LoginPage;
