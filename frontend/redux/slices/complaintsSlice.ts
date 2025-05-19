import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import type { Complaint, ComplaintSubmissionPayload, ApiError } from "@/types";

interface ComplaintsState {
  complaints: Complaint[];
  userComplaints: Complaint[];
  dashboardData: any;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ComplaintsState = {
  complaints: [],
  userComplaints: [],
  dashboardData: null,
  loading: false,
  error: null,
  success: false,
};


export const fetchComplaints = createAsyncThunk<
  Complaint[],
  void,
  { rejectValue: ApiError; state: { auth: { user: any } } }
>("complaints/fetchComplaints", async (_, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().auth;
    let endpoint = "/complaints";

    
    if (user?.role === "sector_admin") {
      endpoint = "/complaints/sector";
    } else if (user?.role === "district_admin") {
      endpoint = "/complaints/district";
    } else if (user?.role === "super_admin") {
      endpoint = "/complaints"; 
    }

    const response = await api.get(endpoint);
    return response.data.complaints;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});


export const fetchUserComplaints = createAsyncThunk<
  Complaint[],
  void,
  { rejectValue: ApiError }
>("complaints/fetchUserComplaints", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/complaints/my-complaints");
    return response.data.complaints || [];
  } catch (error: any) {
    return rejectWithValue(error);
  }
});


export const fetchAdminDashboard = createAsyncThunk<
  any,
  void,
  { rejectValue: ApiError }
>("complaints/fetchAdminDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/complaints/admin/dashboard");
    return response.data.counts;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const submitComplaint = createAsyncThunk<
  Complaint,
  ComplaintSubmissionPayload,
  { rejectValue: ApiError }
>("complaints/submitComplaint", async (complaintData, { rejectWithValue }) => {
  try {
    const response = await api.post("/complaints", complaintData);
    return response.data.complaint;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const escalateComplaint = createAsyncThunk<
  Complaint,
  string,
  { rejectValue: ApiError }
>("complaints/escalateComplaint", async (complaintId, { rejectWithValue }) => {
  try {
    
    const response = await api.put(`/complaints/${complaintId}/escalate`, {});
    return response.data.complaint;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const resolveComplaint = createAsyncThunk<
  Complaint,
  string,
  { rejectValue: ApiError }
>("complaints/resolveComplaint", async (complaintId, { rejectWithValue }) => {
  try {
    
    const response = await api.put(`/complaints/${complaintId}/resolve`, {});
    return response.data.complaint;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    clearComplaintError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchComplaints.fulfilled,
        (state, action: PayloadAction<Complaint[]>) => {
          state.loading = false;
          state.complaints = action.payload;
        }
      )
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch complaints";
      })

      
      .addCase(fetchUserComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserComplaints.fulfilled,
        (state, action: PayloadAction<Complaint[]>) => {
          state.loading = false;
          state.userComplaints = action.payload;
        }
      )
      .addCase(fetchUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch your complaints";
      })

      
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminDashboard.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.dashboardData = action.payload;
        }
      )
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch dashboard data";
      })

      
      .addCase(submitComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        submitComplaint.fulfilled,
        (state, action: PayloadAction<Complaint>) => {
          state.loading = false;
          state.complaints.push(action.payload);
          state.userComplaints.push(action.payload);
          state.success = true;
        }
      )
      .addCase(submitComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit complaint";
        state.success = false;
      })

      
      .addCase(escalateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        escalateComplaint.fulfilled,
        (state, action: PayloadAction<Complaint>) => {
          state.loading = false;
          const index = state.complaints.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) {
            state.complaints[index] = action.payload;
          }

          const userIndex = state.userComplaints.findIndex(
            (c) => c._id === action.payload._id
          );
          if (userIndex !== -1) {
            state.userComplaints[userIndex] = action.payload;
          }
        }
      )
      .addCase(escalateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to escalate complaint";
      })

      
      .addCase(resolveComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        resolveComplaint.fulfilled,
        (state, action: PayloadAction<Complaint>) => {
          state.loading = false;
          const index = state.complaints.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) {
            state.complaints[index] = action.payload;
          }

          const userIndex = state.userComplaints.findIndex(
            (c) => c._id === action.payload._id
          );
          if (userIndex !== -1) {
            state.userComplaints[userIndex] = action.payload;
          }
        }
      )
      .addCase(resolveComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to resolve complaint";
      });
  },
});

export const { clearComplaintError, resetSuccess } = complaintsSlice.actions;
export default complaintsSlice.reducer;
