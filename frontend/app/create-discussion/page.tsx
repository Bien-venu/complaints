"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createDiscussion, clearDiscussionError } from "@/redux/slices/discussionsSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

export default function CreateDiscussion() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  })

  const { loading, error } = useAppSelector((state) => state.discussions)
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

    const discussionData = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }

    const resultAction = await dispatch(createDiscussion(discussionData))

    if (createDiscussion.fulfilled.match(resultAction)) {
      router.push("/discussions")
    }
  }

  return (
    <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create a New Discussion</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Start a discussion about issues in your community.</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearDiscussionError())} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Title"
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title for your discussion"
            />

            <Textarea
              label="Description"
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue or topic you want to discuss"
              rows={5}
            />

            <Input
              label="Tags (comma-separated)"
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="infrastructure, water, security"
            />

            <div>
              <Button type="submit" isLoading={loading}>
                Create Discussion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
