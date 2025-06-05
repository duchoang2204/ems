import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginApi } from "../../api/authApi";

interface LoginParams {
  g_mabc: string;
  manv: number;
  mkhau: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ g_mabc, manv, mkhau }: LoginParams) => {
    const res = await loginApi(g_mabc, manv, mkhau);
    return res.data;
  }
);

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Đăng nhập thất bại";
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
