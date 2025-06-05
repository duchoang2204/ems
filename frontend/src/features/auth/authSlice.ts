import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi";

export const login = createAsyncThunk(
  "auth/login",
  async ({ g_mabc, manv, mkhau }: { g_mabc: string; manv: number; mkhau: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(g_mabc, manv, mkhau);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { msg: "Đăng nhập thất bại!" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null as any },
  reducers: { logout: (state) => { state.user = null; } },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
