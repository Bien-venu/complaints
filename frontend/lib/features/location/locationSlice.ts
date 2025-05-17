import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface LocationState {
  country: string
  province: string
  district: string
  sector: string
  isLoading: boolean
}

const initialState: LocationState = {
  country: "",
  province: "",
  district: "",
  sector: "",
  isLoading: false,
}

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload
      state.province = ""
      state.district = ""
      state.sector = ""
    },
    setProvince: (state, action: PayloadAction<string>) => {
      state.province = action.payload
      state.district = ""
      state.sector = ""
    },
    setDistrict: (state, action: PayloadAction<string>) => {
      state.district = action.payload
      state.sector = ""
    },
    setSector: (state, action: PayloadAction<string>) => {
      state.sector = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetLocation: (state) => {
      state.country = ""
      state.province = ""
      state.district = ""
      state.sector = ""
    },
  },
})

export const { setCountry, setProvince, setDistrict, setSector, setLoading, resetLocation } = locationSlice.actions
export default locationSlice.reducer
