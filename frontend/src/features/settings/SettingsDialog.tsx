import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from "@mui/material";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [admin, setAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [gMabc, setGMabc] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleCheckAdmin = async () => {
    // TODO: Thực tế nên gọi API kiểm tra admin mucdo=9!
    if (admin === "admin" && password === "adminpw") {
      setStep(2);
      setError("");
    } else {
      setError("Tài khoản admin sai");
    }
  };

  const handleSave = () => {
    if (gMabc !== "100916" && gMabc !== "101000") {
      setError("Chỉ nhận 100916 (HNLT) hoặc 101000 (HNNT)");
      return;
    }
    localStorage.setItem("g_mabc", gMabc);
    setError("");
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cài đặt hệ thống</DialogTitle>
      <DialogContent>
        {step === 1 ? (
          <>
            <TextField label="Tài khoản admin" fullWidth value={admin} onChange={e => setAdmin(e.target.value)} margin="normal" />
            <TextField label="Mật khẩu admin" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} margin="normal" />
            {error && <Typography color="error">{error}</Typography>}
          </>
        ) : (
          <>
            <TextField label="Mã database (g_mabc)" fullWidth value={gMabc} onChange={e => setGMabc(e.target.value)} margin="normal" />
            {error && <Typography color="error">{error}</Typography>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 ? (
          <Button onClick={handleCheckAdmin}>Xác nhận</Button>
        ) : (
          <Button onClick={handleSave}>Lưu cấu hình</Button>
        )}
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
}
