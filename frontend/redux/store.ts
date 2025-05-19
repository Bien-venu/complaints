import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import discussionsReducer from "./slices/discussionsSlice"
import complaintsReducer from "./slices/complaintsSlice"
import usersReducer from "./slices/usersSlice"
import groupsReducer from "./slices/groupsSlice"
import feedbackReducer from "./slices/feedbackSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    discussions: discussionsReducer,
    complaints: complaintsReducer,
    users: usersReducer,
    groups: groupsReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
