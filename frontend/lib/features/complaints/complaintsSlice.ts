import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Response {
  id: string
  content: string
  responder: string
  createdAt: string
}

export interface Complaint {
  id: string
  title: string
  category: string
  description: string
  location: string
  status: string
  createdAt: string
  updatedAt: string
  responses: Response[]
  country: string
  province: string
  district: string
  sector: string
  assignedTo: string
  escalationLevel: "sector" | "district" | "super" | null
  escalationReason?: string
  isEscalated: boolean
}

interface ComplaintsState {
  complaints: Complaint[]
  filter: {
    status: string
    category: string
    search: string
    location: string
  }
}

const initialState: ComplaintsState = {
  complaints: [
    {
      id: "complaint-1",
      title: "Pothole on Main Street",
      category: "infrastructure",
      description:
        "There is a large pothole on Main Street near the intersection with Oak Avenue. It has been there for several weeks and is causing damage to vehicles.",
      location: "Main Street and Oak Avenue",
      status: "in-progress",
      createdAt: "2023-05-10T10:30:00Z",
      updatedAt: "2023-05-12T14:20:00Z",
      responses: [
        {
          id: "response-1",
          content: "Thank you for reporting this issue. We have dispatched a team to assess the damage.",
          responder: "Road Maintenance Dept",
          createdAt: "2023-05-11T09:15:00Z",
        },
      ],
      country: "Rwanda",
      province: "Kigali",
      district: "Kigali",
      sector: "Gasabo",
      assignedTo: "admin-3",
      escalationLevel: null,
      isEscalated: false,
    },
    {
      id: "complaint-2",
      title: "Streetlight not working",
      category: "utilities",
      description:
        "The streetlight at the corner of Pine Street and 5th Avenue has been out for over a week, creating a safety hazard at night.",
      location: "Pine Street and 5th Avenue",
      status: "pending",
      createdAt: "2023-05-15T18:45:00Z",
      updatedAt: "2023-05-15T18:45:00Z",
      responses: [],
      country: "Rwanda",
      province: "Kigali",
      district: "Kigali",
      sector: "Kicukiro",
      assignedTo: "admin-4",
      escalationLevel: null,
      isEscalated: false,
    },
    {
      id: "complaint-3",
      title: "Garbage not collected",
      category: "sanitation",
      description:
        "The garbage on Cedar Lane has not been collected for two weeks. This is causing an unpleasant smell and attracting pests.",
      location: "Cedar Lane",
      status: "resolved",
      createdAt: "2023-05-01T08:20:00Z",
      updatedAt: "2023-05-05T11:30:00Z",
      responses: [
        {
          id: "response-2",
          content: "We apologize for the inconvenience. There was a scheduling error that has now been corrected.",
          responder: "Sanitation Dept",
          createdAt: "2023-05-02T10:45:00Z",
        },
        {
          id: "response-3",
          content: "A collection team has been dispatched and will collect the garbage today.",
          responder: "Sanitation Dept",
          createdAt: "2023-05-03T09:30:00Z",
        },
      ],
      country: "Rwanda",
      province: "Kigali",
      district: "Kigali",
      sector: "Gasabo",
      assignedTo: "admin-3",
      escalationLevel: null,
      isEscalated: false,
    },
    {
      id: "complaint-4",
      title: "Water supply interruption",
      category: "utilities",
      description: "No water supply in our neighborhood for the past 48 hours. Multiple households affected.",
      location: "Kimihurura Residential Area",
      status: "pending",
      createdAt: "2023-06-01T09:20:00Z",
      updatedAt: "2023-06-01T09:20:00Z",
      responses: [],
      country: "Rwanda",
      province: "Kigali",
      district: "Kigali",
      sector: "Kicukiro",
      assignedTo: "admin-4",
      escalationLevel: "district",
      escalationReason: "Requires district water authority intervention",
      isEscalated: true,
    },
  ],
  filter: {
    status: "all",
    category: "all",
    search: "",
    location: "all",
  },
}

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.complaints.push(action.payload)
    },
    updateComplaint: (state, action: PayloadAction<{ id: string; complaint: Partial<Complaint> }>) => {
      const index = state.complaints.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.complaints[index] = {
          ...state.complaints[index],
          ...action.payload.complaint,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    addResponse: (state, action: PayloadAction<{ complaintId: string; response: Response }>) => {
      const complaint = state.complaints.find((c) => c.id === action.payload.complaintId)
      if (complaint) {
        complaint.responses.push(action.payload.response)
        complaint.updatedAt = new Date().toISOString()
      }
    },
    setFilter: (
      state,
      action: PayloadAction<{ status: string; category: string; search: string; location: string }>,
    ) => {
      state.filter = action.payload
    },
    escalateComplaint: (
      state,
      action: PayloadAction<{
        complaintId: string
        escalationLevel: "sector" | "district" | "super"
        escalationReason: string
        assignedTo: string
      }>,
    ) => {
      const complaint = state.complaints.find((c) => c.id === action.payload.complaintId)
      if (complaint) {
        complaint.escalationLevel = action.payload.escalationLevel
        complaint.escalationReason = action.payload.escalationReason
        complaint.assignedTo = action.payload.assignedTo
        complaint.isEscalated = true
        complaint.updatedAt = new Date().toISOString()
      }
    },
    resolveEscalation: (state, action: PayloadAction<{ complaintId: string }>) => {
      const complaint = state.complaints.find((c) => c.id === action.payload.complaintId)
      if (complaint) {
        complaint.isEscalated = false
        complaint.escalationLevel = null
        complaint.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const { addComplaint, updateComplaint, addResponse, setFilter, escalateComplaint, resolveEscalation } =
  complaintsSlice.actions

export default complaintsSlice.reducer
