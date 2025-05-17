import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import complaintsReducer from "@/lib/features/complaints/complaintsSlice"
import locationReducer from "@/lib/features/location/locationSlice"
import roleReducer from "@/lib/features/roles/roleSlice"
import { apiSlice } from "@/lib/features/api/apiSlice"
import { locationApi } from "@/lib/features/api/locationApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
    location: locationReducer,
    role: roleReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(locationApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
