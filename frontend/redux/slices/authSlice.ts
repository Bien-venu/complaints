import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { setCookie, deleteCookie } from "cookies-next";
import { api } from "@/lib/api"; 
import type {
  User,
  LoginPayload,
  RegistrationPayload,
  LoginResponse,
  ApiError,
} from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk<
  User,
  RegistrationPayload,
  { rejectValue: ApiError }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const login = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: ApiError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response: LoginResponse = await api.post("/auth/login", credentials);

    
    setCookie("auth_token", response.token, {
      maxAge: 30 * 24 * 60 * 60, 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.user;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  deleteCookie("auth_token");
  return null;
});

export const getCurrentUser = createAsyncThunk<
  User, 
  void, 
  { rejectValue: ApiError } 
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  
  try {
    const user = await api.get("/users/me");
    return user.data.user; 
  } catch (error: any) {
    if (error.status && error.message) {
      
      return rejectWithValue({
        message: error.message,
        status: error.status,
      } as ApiError);
    }
    return rejectWithValue({
      message: error.message || "An unexpected error occurred",
    } as ApiError);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
