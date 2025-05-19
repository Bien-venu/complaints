import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import type { Analytics, FeedbackSubmissionPayload, ApiError } from "@/types";

interface FeedbackState {
  analytics: Analytics[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: FeedbackState = {
  analytics: [],
  loading: false,
  error: null,
  success: false,
};

export const submitFeedback = createAsyncThunk<
  any, 
  FeedbackSubmissionPayload,
  { rejectValue: ApiError }
>("feedback/submitFeedback", async (feedbackData, { rejectWithValue }) => {
  try {
    const response = await api.post("/feedback", feedbackData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchFeedbackAnalytics = createAsyncThunk<
  Analytics[],
  void,
  { rejectValue: ApiError }
>("feedback/fetchFeedbackAnalytics", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/feedback/analytics");
    return response.data.analytics;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedbackError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit feedback";
        state.success = false;
      })

      
      .addCase(fetchFeedbackAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeedbackAnalytics.fulfilled,
        (state, action: PayloadAction<Analytics[]>) => {
          state.loading = false;
          state.analytics = action.payload;
        }
      )
      .addCase(fetchFeedbackAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch feedback analytics";
      });
  },
});

export const { clearFeedbackError, resetSuccess } = feedbackSlice.actions;
export default feedbackSlice.reducer;
