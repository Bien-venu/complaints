import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import type {
  Group,
  GroupCreationPayload,
  AnnouncementCreationPayload,
  Announcement,
  ApiError,
  User,
  Members,
} from "@/types";

interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  announcements: Announcement[];
  groupMembers: Members[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: null,
  announcements: [],
  groupMembers: [],
  loading: false,
  error: null,
  success: false,
};

export const fetchGroups = createAsyncThunk<
  Group[],
  void,
  { rejectValue: ApiError }
>("groups/fetchGroups", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/groups");
    return response.data.groups;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchGroupById = createAsyncThunk<
  Group,
  string,
  { rejectValue: ApiError }
>("groups/fetchGroupById", async (groupId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/groups/${groupId}`);
    return response.data.group;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createGroup = createAsyncThunk<
  Group,
  GroupCreationPayload,
  { rejectValue: ApiError }
>("groups/createGroup", async (groupData, { rejectWithValue }) => {
  try {
    const response = await api.post("/groups", groupData);
    return response.data.group;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const joinGroup = createAsyncThunk<
  Group,
  string, 
  { rejectValue: ApiError }
>("groups/joinGroup", async (userId, { rejectWithValue }) => {
  try {
    
    const response = await api.patch(`/groups/${userId}/join`);
    return response.data.group;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchGroupAnnouncements = createAsyncThunk<
  Announcement[],
  string,
  { rejectValue: ApiError }
>("groups/fetchGroupAnnouncements", async (groupId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/groups/${groupId}/announcements`);
    return response.data.announcements;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createAnnouncement = createAsyncThunk<
  Announcement,
  { groupId: string; announcementData: AnnouncementCreationPayload },
  { rejectValue: ApiError }
>(
  "groups/createAnnouncement",
  async ({ groupId, announcementData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/groups/${groupId}/announcements`,
        announcementData
      );
      return response.data.announcement;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);


export const fetchGroupMembers = createAsyncThunk<
  Members[],
  string,
  { rejectValue: ApiError }
>("groups/fetchGroupMembers", async (groupId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/groups/${groupId}/members`);
    return response.data.members;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearGroupError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGroups.fulfilled,
        (state, action: PayloadAction<Group[]>) => {
          state.loading = false;
          state.groups = action.payload;
        }
      )
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch groups";
      })

      
      .addCase(fetchGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGroupById.fulfilled,
        (state, action: PayloadAction<Group>) => {
          state.loading = false;
          state.currentGroup = action.payload;
        }
      )
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch group";
      })

      
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.loading = false;
        state.groups.push(action.payload);
        state.success = true;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create group";
        state.success = false;
      })

      
      .addCase(joinGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.loading = false; 
        state.currentGroup = action.payload;
        state.success = true; 
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to join group";
      })

      
      .addCase(fetchGroupAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGroupAnnouncements.fulfilled,
        (state, action: PayloadAction<Announcement[]>) => {
          state.loading = false;
          state.announcements = action.payload;
        }
      )
      .addCase(fetchGroupAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch announcements";
      })

      
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.loading = false;
          state.announcements.push(action.payload);
          state.success = true;
        }
      )
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create announcement";
        state.success = false;
      })

      
      .addCase(fetchGroupMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGroupMembers.fulfilled,
        (state, action: PayloadAction<Members[]>) => {
          state.loading = false;
          state.groupMembers = action.payload;
        }
      )
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch group members";
      });
  },
});

export const { clearGroupError, resetSuccess, clearCurrentGroup } =
  groupsSlice.actions;
export default groupsSlice.reducer;
