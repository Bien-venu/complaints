import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
  role: "citizen" | "admin" | "super" | "district" | "sector"
  district?: string
  sector?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
}

const loadAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: true,
    }
  }

  try {
    const authData = localStorage.getItem("auth")
    if (authData) {
      return {
        ...JSON.parse(authData),
        isLoading: false,
      }
    }
  } catch (error) {
    console.error("Error loading auth state from localStorage", error)
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  }
}

const initialState: AuthState = loadAuthState()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            isAuthenticated: true,
            user: action.payload.user,
            token: action.payload.token,
          }),
        )
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth")
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              isAuthenticated: state.isAuthenticated,
              user: state.user,
              token: state.token,
            }),
          )
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { login, logout, updateUser, setLoading } = authSlice.actions
export default authSlice.reducer
