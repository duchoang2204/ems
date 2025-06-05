import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const checkShift = async (g_mabc: string) => {
  const res = await axios.post(`${API_URL}/shift/check`, { g_mabc });
  return res.data;
};
