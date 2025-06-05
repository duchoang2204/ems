import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { Button, TextField, Typography, Box, Container, Paper } from "@mui/material";
import type { RootState, AppDispatch } from "../../app/store";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [manv, setManv] = useState("");
  const [mkhau, setMkhau] = useState("");
  const [manvError, setManvError] = useState<string | null>(null);
  const [mkhauError, setMkhauError] = useState<string | null>(null);

  const g_mabc = localStorage.getItem("g_mabc") || "100916";
  const loading = useSelector((state: RootState) => state.auth.loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManvError(null);
    setMkhauError(null);
    try {
      await dispatch(login({ g_mabc, manv: Number(manv), mkhau }))
        .unwrap()
        .catch((err: any) => {
          const code = err?.code;
          if (code === "USER_NOT_FOUND") setManvError(err.msg);
          else if (code === "WRONG_PASSWORD") setMkhauError(err.msg);
          else setManvError("Lỗi đăng nhập không xác định");
          throw err;
        });
      // Kiểm tra ca...
    } catch {}
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
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
              error={!!manvError}
              helperText={manvError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type="password"
              value={mkhau}
              onChange={e => setMkhau(e.target.value)}
              error={!!mkhauError}
              helperText={mkhauError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
