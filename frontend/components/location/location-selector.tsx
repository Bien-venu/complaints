"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCountry, setProvince, setDistrict, setSector, setLoading } from "@/lib/features/location/locationSlice"
import {
  useGetCountriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetSectorsQuery,
} from "@/lib/features/api/locationApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { RootState } from "@/lib/store"

export function LocationSelector() {
  const dispatch = useDispatch()
  const { country, province, district, sector } = useSelector((state: RootState) => state.location)

  const [countryId, setCountryId] = useState<string>("")
  const [provinceId, setProvinceId] = useState<string>("")
  const [districtId, setDistrictId] = useState<string>("")
  const [sectorId, setSectorId] = useState<string>("")

  const { data: countries, isLoading: isLoadingCountries, error: countriesError } = useGetCountriesQuery()
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery(countryId, { skip: !countryId })
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(
    { countryId, provinceId },
    { skip: !countryId || !provinceId },
  )
  const { data: sectors, isLoading: isLoadingSectors } = useGetSectorsQuery(
    { countryId, provinceId, districtId },
    { skip: !countryId || !provinceId || !districtId },
  )

  useEffect(() => {
    dispatch(setLoading(isLoadingCountries || isLoadingProvinces || isLoadingDistricts || isLoadingSectors))
  }, [dispatch, isLoadingCountries, isLoadingProvinces, isLoadingDistricts, isLoadingSectors])

  const handleCountryChange = (value: string) => {
    const selectedCountry = countries?.find((c) => c.id === value)
    if (selectedCountry) {
      setCountryId(value)
      dispatch(setCountry(selectedCountry.name))
      setProvinceId("")
      setDistrictId("")
      setSectorId("")
    }
  }

  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinces?.find((p) => p.id === value)
    if (selectedProvince) {
      setProvinceId(value)
      dispatch(setProvince(selectedProvince.name))
      setDistrictId("")
      setSectorId("")
    }
  }

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts?.find((d) => d.id === value)
    if (selectedDistrict) {
      setDistrictId(value)
      dispatch(setDistrict(selectedDistrict.name))
      setSectorId("")
    }
  }

  const handleSectorChange = (value: string) => {
    const selectedSector = sectors?.find((s) => s.id === value)
    if (selectedSector) {
      setSectorId(value)
      dispatch(setSector(selectedSector.name))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          Country <span className="text-red-500">*</span>
        </label>
        {isLoadingCountries ? (
          <Skeleton className="h-10 w-full" />
        ) : countriesError ? (
          <div className="text-sm text-red-500 p-2 border border-red-200 rounded-md bg-red-50">
            Error loading countries. Please try again.
          </div>
        ) : (
          <Select value={countryId} onValueChange={handleCountryChange}>
            <SelectTrigger id="country" className="bg-white">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {countryId && (
        <div className="space-y-2">
          <label htmlFor="province" className="text-sm font-medium">
            Province
          </label>
          {isLoadingProvinces ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={provinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger id="province" className="bg-white">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {provinces?.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {provinceId && (
        <div className="space-y-2">
          <label htmlFor="district" className="text-sm font-medium">
            District
          </label>
          {isLoadingDistricts ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={districtId} onValueChange={handleDistrictChange}>
              <SelectTrigger id="district" className="bg-white">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {districts?.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {districtId && (
        <div className="space-y-2">
          <label htmlFor="sector" className="text-sm font-medium">
            Sector
          </label>
          {isLoadingSectors ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={sectorId} onValueChange={handleSectorChange}>
              <SelectTrigger id="sector" className="bg-white">
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {country && province && district && sector && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          <p className="font-medium">Selected Location:</p>
          <p className="text-sm">
            {country} → {province} → {district} → {sector}
          </p>
        </div>
      )}
    </div>
  )
}
