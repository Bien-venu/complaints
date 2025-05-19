"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { submitFeedback, clearFeedbackError, resetSuccess } from "@/redux/slices/feedbackSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

const serviceTypes = [
  { value: "transport", label: "Transport" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "security", label: "Security" },
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "other", label: "Other" },
]

const ratings = [
  { value: "1", label: "1 - Very Poor" },
  { value: "2", label: "2 - Poor" },
  { value: "3", label: "3 - Average" },
  { value: "4", label: "4 - Good" },
  { value: "5", label: "5 - Excellent" },
]

export default function SubmitFeedback() {
  const [formData, setFormData] = useState({
    serviceType: "transport",
    rating: "3",
    comments: "",
  })

  const { loading, error, success } = useAppSelector((state) => state.feedback)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const feedbackData = {
      serviceType: formData.serviceType,
      rating: Number.parseInt(formData.rating),
      comments: formData.comments,
    }

    await dispatch(submitFeedback(feedbackData))
  }

  if (success) {
    return (
      <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Feedback Submitted Successfully</h3>
            <p className="mt-1 text-sm text-gray-500">
              Thank you for your feedback. Your input helps us improve our services.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  dispatch(resetSuccess())
                  router.push("/")
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Submit Feedback</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Please provide your feedback on government services.</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearFeedbackError())} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Select
              label="Service Type"
              id="serviceType"
              name="serviceType"
              required
              value={formData.serviceType}
              onChange={handleChange}
              options={serviceTypes}
            />

            <Select
              label="Rating"
              id="rating"
              name="rating"
              required
              value={formData.rating}
              onChange={handleChange}
              options={ratings}
            />

            <Textarea
              label="Comments"
              id="comments"
              name="comments"
              required
              value={formData.comments}
              onChange={handleChange}
              placeholder="Please provide your feedback and suggestions"
              rows={5}
            />

            <div>
              <Button type="submit" isLoading={loading}>
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
