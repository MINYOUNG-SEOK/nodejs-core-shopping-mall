import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch(clearUser());
  dispatch(
    showToastMessage({
      message: "로그아웃되었습니다.",
      status: "success",
    })
  );
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다.",
          status: "success",
        })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입을 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token"); // 추가: 토큰이 없으면 API 호출하지 않음
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`, // 추가: 토큰을 헤더에 포함하여 전송
        },
      });
      return response.data;
    } catch (error) {
      sessionStorage.removeItem("token");
      return rejectWithValue(error.error || "Token validation failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    isAuthenticating: true,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loginError = null;
      state.registrationError = null;
      state.success = false;
      state.isAuthenticating = false;
    },
    // loginWithToken 실패 시 isAuthenticating을 false로 설정하는 액션 추가
    stopAuthenticating: (state) => {
      state.isAuthenticating = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser 핸들러
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      })

      // loginWithEmail 핸들러
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
        state.isAuthenticating = false;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
        state.isAuthenticating = false;
      })

      // loginWithToken 핸들러 수정
      .addCase(loginWithToken.pending, (state) => {
        state.isAuthenticating = true;
        state.loading = true;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
        state.isAuthenticating = false;
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.loginError = null;
        state.isAuthenticating = false;
      });
  },
});
export const { clearErrors, clearUser, stopAuthenticating } = userSlice.actions;
export default userSlice.reducer;
