import axiosInstance from './axiosConfig';

export const login = (g_mabc: string, manv: number, mkhau: string) =>
  axiosInstance.post('/auth/login', { g_mabc, manv, mkhau });
