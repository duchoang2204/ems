// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Button, TextField, Typography, Box, Container, Paper, CircularProgress } from "@mui/material";
import type { RootState, AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [manv, setManv] = useState("");
  const [mkhau, setMkhau] = useState("");
  const [manvError, setManvError] = useState<string | null>(null);
  const [mkhauError, setMkhauError] = useState<string | null>(null);

  const g_mabc = localStorage.getItem("g_mabc") || "100916";
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManvError(null);
    setMkhauError(null);

    try {
      await dispatch(login({ g_mabc, manv: Number(manv), mkhau }))
        .unwrap()
        .then(() => {
          navigate("/"); // Về dashboard sau login thành công
        })
        .catch((err: any) => {
          // Xử lý lỗi chi tiết từng trường
          const code = err?.code;
          if (code === "USER_NOT_FOUND") setManvError(err.msg);
          else if (code === "WRONG_PASSWORD") setMkhauError(err.msg);
          else setManvError(err?.msg || "Đăng nhập thất bại!");
        });
    } catch {}
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
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
            {error && !manvError && !mkhauError && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {typeof error === "string" ? error : error?.msg}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
              endIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              Đăng nhập
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
