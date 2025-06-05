// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi";
import { User } from "../../types/user.interface";

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { g_mabc: string; manv: number; mkhau: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload.g_mabc, payload.manv, payload.mkhau);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { msg: "Đăng nhập thất bại!" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null as User | null, token: "", loading: false, error: null as any },
  reducers: { logout: (state) => { state.user = null; state.token = ""; } },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});
export default authSlice.reducer;
export const { logout } = authSlice.actions;
