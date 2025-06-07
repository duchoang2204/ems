import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import StorageIcon from "@mui/icons-material/Storage";
import PrintIcon from "@mui/icons-material/Print";
import RouterIcon from "@mui/icons-material/Router";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const steps = ["Xác thực Admin", "Cấu hình hệ thống"];

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [admin, setAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  // Cấu hình hệ thống
  const [gMabc, setGMabc] = useState(localStorage.getItem("g_mabc") || "");
  const [ipLan, setIpLan] = useState(localStorage.getItem("ip_lan") || "");
  const [printerName, setPrinterName] = useState(localStorage.getItem("printer_name") || "");
  const [apiUrl, setApiUrl] = useState(localStorage.getItem("api_url") || "");

  useEffect(() => {
    if (!open) {
      // Reset form khi đóng dialog
      setStep(0);
      setError("");
      setAdmin("");
      setPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const handleCheckAdmin = async () => {
    // TODO: Thực tế nên gọi API kiểm tra admin mucdo=9!
    if (admin === "2204" && password === "22041985") {
      setStep(1);
      setError("");
    } else {
      setError("Tài khoản admin không chính xác!");
    }
  };

  const validateSettings = () => {
    if (!gMabc) {
      setError("Vui lòng nhập mã database!");
      return false;
    }
    if (gMabc !== "100916" && gMabc !== "101000") {
      setError("Mã database chỉ chấp nhận: 100916 (HNLT) hoặc 101000 (HNNT)");
      return false;
    }
    if (!ipLan) {
      setError("Vui lòng nhập địa chỉ IP LAN!");
      return false;
    }
    // Validate IP format
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ipLan)) {
      setError("Địa chỉ IP không hợp lệ!");
      return false;
    }
    if (!printerName) {
      setError("Vui lòng nhập tên máy in!");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateSettings()) return;

    // Lưu các cài đặt vào localStorage
    localStorage.setItem("g_mabc", gMabc);
    localStorage.setItem("ip_lan", ipLan);
    localStorage.setItem("printer_name", printerName);
    if (apiUrl) localStorage.setItem("api_url", apiUrl);

    setError("");
    onClose();
    window.location.reload();
  };

  const getDbName = (mabc: string) => {
    switch (mabc) {
      case "100916": return "HNLT";
      case "101000": return "HNNT";
      default: return "";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.paper",
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AdminPanelSettingsIcon color="primary" />
          <Typography variant="h6" component="span">
            Cài đặt hệ thống
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 ? (
          <Box>
            <TextField
              label="Tài khoản admin"
              fullWidth
              value={admin}
              onChange={e => setAdmin(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              label="Mật khẩu admin"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="off"
              InputProps={{
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
          </Box>
        ) : (
          <Box>
            <TextField
              label="Mã database (g_mabc)"
              fullWidth
              value={gMabc}
              onChange={e => setGMabc(e.target.value)}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StorageIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText={getDbName(gMabc) ? `Database: ${getDbName(gMabc)}` : "Chỉ chấp nhận: 100916 (HNLT) hoặc 101000 (HNNT)"}
            />
            <TextField
              label="Địa chỉ IP LAN"
              fullWidth
              value={ipLan}
              onChange={e => setIpLan(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Ví dụ: 192.168.1.100"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RouterIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Tên máy in"
              fullWidth
              value={printerName}
              onChange={e => setPrinterName(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Nhập tên máy in mặc định"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PrintIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="API URL (tùy chọn)"
              fullWidth
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="http://api.example.com"
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={step === 0 ? handleCheckAdmin : handleSave}
          variant="contained"
          sx={{
            minWidth: 100,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {step === 0 ? "Tiếp tục" : "Lưu cài đặt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
