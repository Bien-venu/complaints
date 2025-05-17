import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type AdminRole = "super" | "district" | "sector" | "citizen"

export interface AdminInfo {
  id: string
  name: string
  role: AdminRole
  district?: string
  sector?: string
}

interface RoleState {
  currentRole: AdminRole
  adminInfo: AdminInfo | null
  assignedAdmins: AdminInfo[]
}

const initialState: RoleState = {
  currentRole: "citizen",
  adminInfo: null,
  assignedAdmins: [
    { id: "admin-1", name: "Super Admin", role: "super" },
    { id: "admin-2", name: "Kigali District Admin", role: "district", district: "Kigali" },
    { id: "admin-3", name: "Gasabo Sector Admin", role: "sector", district: "Kigali", sector: "Gasabo" },
    { id: "admin-4", name: "Kicukiro Sector Admin", role: "sector", district: "Kigali", sector: "Kicukiro" },
  ],
}

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setCurrentRole: (state, action: PayloadAction<AdminRole>) => {
      state.currentRole = action.payload
    },
    setAdminInfo: (state, action: PayloadAction<AdminInfo | null>) => {
      state.adminInfo = action.payload
    },
    addAdmin: (state, action: PayloadAction<AdminInfo>) => {
      state.assignedAdmins.push(action.payload)
    },
    removeAdmin: (state, action: PayloadAction<string>) => {
      state.assignedAdmins = state.assignedAdmins.filter((admin) => admin.id !== action.payload)
    },
    updateAdmin: (state, action: PayloadAction<AdminInfo>) => {
      const index = state.assignedAdmins.findIndex((admin) => admin.id === action.payload.id)
      if (index !== -1) {
        state.assignedAdmins[index] = action.payload
      }
    },
  },
})

export const { setCurrentRole, setAdminInfo, addAdmin, removeAdmin, updateAdmin } = roleSlice.actions
export default roleSlice.reducer
