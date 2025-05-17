import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/lib/store"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token

      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ["Complaints", "User"],
  endpoints: (builder) => ({}),
})
