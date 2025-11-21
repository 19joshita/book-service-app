import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/auth";

const initialState: AuthState = {
  isLoggedIn: false,
  email: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state: any, action: PayloadAction<{ email: string }>) {
      state.isLoggedIn = true;
      state.email = action.payload.email;
    },
    logout(state: any) {
      state.isLoggedIn = false;
      state.email = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
