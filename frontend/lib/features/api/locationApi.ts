import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface LocationData {
  id: string
  name: string
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getCountries: builder.query<LocationData[], void>({
      query: () => "/locations/countries",
      transformResponse: () => {
        // Mock data for demo purposes
        return [
          { id: "rw", name: "Rwanda" },
          { id: "ke", name: "Kenya" },
          { id: "ug", name: "Uganda" },
          { id: "tz", name: "Tanzania" },
        ]
      },
    }),
    getProvinces: builder.query<LocationData[], string>({
      query: (countryId) => `/locations/countries/${countryId}/provinces`,
      transformResponse: (_, __, arg) => {
        // Mock data for demo purposes
        if (arg === "rw") {
          return [
            { id: "kgl", name: "Kigali" },
            { id: "est", name: "Eastern Province" },
            { id: "wst", name: "Western Province" },
            { id: "nth", name: "Northern Province" },
            { id: "sth", name: "Southern Province" },
          ]
        } else if (arg === "ke") {
          return [
            { id: "nrb", name: "Nairobi" },
            { id: "mbs", name: "Mombasa" },
            { id: "ksm", name: "Kisumu" },
          ]
        } else if (arg === "ug") {
          return [
            { id: "kmp", name: "Kampala" },
            { id: "jnj", name: "Jinja" },
            { id: "mbl", name: "Mbale" },
          ]
        } else if (arg === "tz") {
          return [
            { id: "dsm", name: "Dar es Salaam" },
            { id: "znz", name: "Zanzibar" },
            { id: "mwz", name: "Mwanza" },
          ]
        }
        return []
      },
    }),
    getDistricts: builder.query<LocationData[], { countryId: string; provinceId: string }>({
      query: ({ countryId, provinceId }) => `/locations/countries/${countryId}/provinces/${provinceId}/districts`,
      transformResponse: (_, __, { provinceId }) => {
        // Mock data for demo purposes
        if (provinceId === "kgl") {
          return [
            { id: "kgl", name: "Kigali" },
            { id: "gsk", name: "Gasabo" },
            { id: "nyg", name: "Nyarugenge" },
            { id: "kck", name: "Kicukiro" },
          ]
        } else if (provinceId === "est") {
          return [
            { id: "kyr", name: "Kayonza" },
            { id: "ngm", name: "Ngoma" },
            { id: "rwr", name: "Rwamagana" },
          ]
        } else if (provinceId === "nrb") {
          return [
            { id: "cbd", name: "Central Business District" },
            { id: "kbr", name: "Kibera" },
            { id: "wst", name: "Westlands" },
          ]
        }
        // Add more mock data for other provinces as needed
        return [
          { id: "d1", name: "District 1" },
          { id: "d2", name: "District 2" },
          { id: "d3", name: "District 3" },
        ]
      },
    }),
    getSectors: builder.query<LocationData[], { countryId: string; provinceId: string; districtId: string }>({
      query: ({ countryId, provinceId, districtId }) =>
        `/locations/countries/${countryId}/provinces/${provinceId}/districts/${districtId}/sectors`,
      transformResponse: (_, __, { districtId }) => {
        // Mock data for demo purposes
        if (districtId === "kgl") {
          return [
            { id: "gsb", name: "Gasabo" },
            { id: "kck", name: "Kicukiro" },
            { id: "kmh", name: "Kimihurura" },
            { id: "ktc", name: "Kacyiru" },
          ]
        } else if (districtId === "gsk") {
          return [
            { id: "rmr", name: "Remera" },
            { id: "kml", name: "Kimironko" },
            { id: "ndr", name: "Nduba" },
          ]
        } else if (districtId === "cbd") {
          return [
            { id: "dtn", name: "Downtown" },
            { id: "upt", name: "Uptown" },
            { id: "mkt", name: "Market" },
          ]
        }
        // Add more mock data for other districts as needed
        return [
          { id: "s1", name: "Sector 1" },
          { id: "s2", name: "Sector 2" },
          { id: "s3", name: "Sector 3" },
        ]
      },
    }),
  }),
})

export const { useGetCountriesQuery, useGetProvincesQuery, useGetDistrictsQuery, useGetSectorsQuery } = locationApi
