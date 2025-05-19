"use client"

import type React from "react"

import { useState, type FormEvent, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchUsers, assignUserRole, clearUserError, resetSuccess } from "@/redux/slices/usersSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

const roles = [
  { value: "citizen", label: "Citizen" },
  { value: "sector_admin", label: "Sector Admin" },
  { value: "district_admin", label: "District Admin" },
  { value: "super_admin", label: "Super Admin" },
]

const provinces = [
  { value: "Kigali", label: "Kigali" },
  { value: "Northern", label: "Northern" },
  { value: "Southern", label: "Southern" },
  { value: "Eastern", label: "Eastern" },
  { value: "Western", label: "Western" },
]

const districts = {
  Kigali: [
    { value: "Gasabo", label: "Gasabo" },
    { value: "Kicukiro", label: "Kicukiro" },
    { value: "Nyarugenge", label: "Nyarugenge" },
  ],
  Northern: [
    { value: "Burera", label: "Burera" },
    { value: "Gakenke", label: "Gakenke" },
    { value: "Gicumbi", label: "Gicumbi" },
    { value: "Musanze", label: "Musanze" },
    { value: "Rulindo", label: "Rulindo" },
  ],
  
}

const sectors = {
  Gasabo: [
    { value: "Remera", label: "Remera" },
    { value: "Kacyiru", label: "Kacyiru" },
    { value: "Kimironko", label: "Kimironko" },
  ],
  Kicukiro: [
    { value: "Niboye", label: "Niboye" },
    { value: "Kagarama", label: "Kagarama" },
    { value: "Gatenga", label: "Gatenga" },
  ],
  
}

export default function AssignRole() {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    role: "citizen",
    province: "Kigali",
    district: "Gasabo",
    sector: "Remera",
  })

  const { users, loading, error, success } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const user = users.find((u) => u._id === id)

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role,
        province: user.assignedLocation.province,
        district: user.assignedLocation.district,
        sector: user.assignedLocation.sector,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    
    if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        district: districts[value as keyof typeof districts]?.[0]?.value || "",
        sector: "",
      }))
    }

    
    if (name === "district") {
      setFormData((prev) => ({
        ...prev,
        sector: sectors[value as keyof typeof sectors]?.[0]?.value || "",
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const roleData = {
      role: formData.role,
      assignedLocation: {
        province: formData.province,
        district: formData.district,
        sector: formData.sector,
      },
    }

    await dispatch(assignUserRole({ userId: id as string, roleData }))
  }

  if (success) {
    return (
      <MainLayout requireAuth={true} allowedRoles={["super_admin"]}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Role Assigned Successfully</h3>
            <p className="mt-1 text-sm text-gray-500">The user's role and assigned location have been updated.</p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  dispatch(resetSuccess())
                  router.push("/admin/users")
                }}
              >
                Return to Users
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout requireAuth={true} allowedRoles={["super_admin"]}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center text-gray-500">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              "User not found"
            )}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout requireAuth={true} allowedRoles={["super_admin"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Role to {user.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Change the user's role and assigned location.</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearUserError())} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Select
              label="Role"
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              options={roles}
            />

            <Select
              label="Province"
              id="province"
              name="province"
              required
              value={formData.province}
              onChange={handleChange}
              options={provinces}
            />

            <Select
              label="District"
              id="district"
              name="district"
              required
              value={formData.district}
              onChange={handleChange}
              options={districts[formData.province as keyof typeof districts] || []}
            />

            <Select
              label="Sector"
              id="sector"
              name="sector"
              required
              value={formData.sector}
              onChange={handleChange}
              options={sectors[formData.district as keyof typeof sectors] || []}
            />

            <div>
              <Button type="submit" isLoading={loading}>
                Assign Role
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
