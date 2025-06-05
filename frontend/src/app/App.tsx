import React, { useState } from "react";
import LoginPage from "../features/auth/LoginPage";
import SettingsDialog from "../features/settings/SettingsDialog";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <LoginPage />
      <Button onClick={() => setSettingsOpen(true)} startIcon={<SettingsIcon />}>
        Settings
      </Button>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
