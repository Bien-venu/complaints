import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import type { User, AssignRolePayload, ApiError } from "@/types";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: ApiError }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users");
    return response.data.users;
  } catch (error: any) {
    console.error("Error in fetchUsers thunk:", error); 
    
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      status: error.response?.status
    };
    return rejectWithValue(apiError);
  }
});

export const assignUserRole = createAsyncThunk<
  User,
  { userId: string; roleData: AssignRolePayload },
  { rejectValue: ApiError }
>("users/assignUserRole", async ({ userId, roleData }, { rejectWithValue }) => {
  try {
    
    const response = await api.post(`/users/${userId}/assign-role`, roleData);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to assign role",
      status: error.response?.status,
    });
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })

      
      .addCase(assignUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        assignUserRole.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;

          
          const index = state.users.findIndex(
            (u) => u.id === action.payload.id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }

          state.success = true;
        }
      )
      .addCase(assignUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to assign role";
        state.success = false;
      });
  },
});

export const { clearUserError, resetSuccess } = usersSlice.actions;
export default usersSlice.reducer;
