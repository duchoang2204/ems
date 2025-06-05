import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const login = (g_mabc: string, manv: number, mkhau: string) =>
  axios.post(`${API_URL}/auth/login`, { g_mabc, manv, mkhau });
