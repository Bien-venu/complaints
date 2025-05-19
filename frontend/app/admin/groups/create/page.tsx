"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createGroup, clearGroupError, resetSuccess } from "@/redux/slices/groupsSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const { loading, error, success } = useAppSelector((state) => state.groups)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    await dispatch(createGroup(formData))
  }

  if (success) {
    return (
      <MainLayout requireAuth={true} allowedRoles={["sector_admin", "district_admin", "super_admin"]}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Group Created Successfully</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your group has been created and is now available for members to join.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  dispatch(resetSuccess())
                  router.push("/admin/groups")
                }}
              >
                View All Groups
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout requireAuth={true} allowedRoles={["sector_admin", "district_admin", "super_admin"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create a New Group</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create a group for your jurisdiction to share announcements and information.
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearGroupError())} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Group Name"
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a name for your group"
            />

            <Textarea
              label="Description"
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this group"
              rows={5}
            />

            <div>
              <Button type="submit" isLoading={loading}>
                Create Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
