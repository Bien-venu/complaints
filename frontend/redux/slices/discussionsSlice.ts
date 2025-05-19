import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import type {
  Discussion,
  DiscussionCreationPayload,
  CommentCreationPayload,
  ApiError,
} from "@/types";

interface DiscussionsState {
  discussions: Discussion[];
  currentDiscussion: Discussion | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiscussionsState = {
  discussions: [],
  currentDiscussion: null,
  loading: false,
  error: null,
};

export const fetchDiscussions = createAsyncThunk<
  Discussion[],
  void,
  { rejectValue: ApiError }
>("discussions/fetchDiscussions", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/discussions");
    return response.data.discussions;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchDiscussionById = createAsyncThunk<
  Discussion,
  string,
  { rejectValue: ApiError }
>(
  "discussions/fetchDiscussionById",
  async (discussionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/discussions/${discussionId}`);
      return response.data.discussion;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createDiscussion = createAsyncThunk<
  Discussion,
  DiscussionCreationPayload,
  { rejectValue: ApiError }
>(
  "discussions/createDiscussion",
  async (discussionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/discussions", discussionData);
      return response.data.discussion;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const addComment = createAsyncThunk<
  Discussion,
  { discussionId: string; commentData: CommentCreationPayload },
  { rejectValue: ApiError }
>(
  "discussions/addComment",
  async ({ discussionId, commentData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/discussions/${discussionId}/comments`,
        commentData
      );
      return response.data.discussion;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const resolveDiscussion = createAsyncThunk<
  Discussion,
  string,
  { rejectValue: ApiError }
>(
  "discussions/resolveDiscussion",
  async (discussionId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/discussions/${discussionId}/resolve`);
      return response.data.discussion;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    clearDiscussionError: (state) => {
      state.error = null;
    },
    clearCurrentDiscussion: (state) => {
      state.currentDiscussion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchDiscussions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscussions.fulfilled,
        (state, action: PayloadAction<Discussion[]>) => {
          state.loading = false;
          state.discussions = action.payload;
        }
      )
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch discussions";
      })

      
      .addCase(fetchDiscussionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscussionById.fulfilled,
        (state, action: PayloadAction<Discussion>) => {
          state.loading = false;
          state.currentDiscussion = action.payload;
        }
      )
      .addCase(fetchDiscussionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch discussion";
      })

      
      .addCase(createDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createDiscussion.fulfilled,
        (state, action: PayloadAction<Discussion>) => {
          state.loading = false;
          state.discussions.push(action.payload);
        }
      )
      .addCase(createDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create discussion";
      })

      
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Discussion>) => {
          state.loading = false;
          state.currentDiscussion = action.payload;

          
          const index = state.discussions.findIndex(
            (d) => d._id === action.payload._id
          );
          if (index !== -1) {
            state.discussions[index] = action.payload;
          }
        }
      )
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add comment";
      })

      
      .addCase(resolveDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        resolveDiscussion.fulfilled,
        (state, action: PayloadAction<Discussion>) => {
          state.loading = false;

          
          const index = state.discussions.findIndex(
            (d) => d._id === action.payload._id
          );
          if (index !== -1) {
            state.discussions[index] = action.payload;
          }

          
          if (
            state.currentDiscussion &&
            state.currentDiscussion._id === action.payload._id
          ) {
            state.currentDiscussion = action.payload;
          }
        }
      )
      .addCase(resolveDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to resolve discussion";
      });
  },
});

export const { clearDiscussionError, clearCurrentDiscussion } =
  discussionsSlice.actions;
export default discussionsSlice.reducer;
