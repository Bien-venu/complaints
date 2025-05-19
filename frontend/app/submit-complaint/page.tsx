"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  submitComplaint,
  clearComplaintError,
  resetSuccess,
} from "@/redux/slices/complaintsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const categories = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "sanitation", label: "Sanitation" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    category: "infrastructure",
    title: "",
    description: "",
    location: {
      sector: "Remera",
      district: "Gasabo",
    },
  });

  const { loading, error, success } = useAppSelector(
    (state) => state.complaints
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(submitComplaint(formData));
  };

  if (success) {
    return (
      <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Complaint Submitted Successfully
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your complaint has been submitted and will be reviewed by the
              appropriate authorities.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  dispatch(resetSuccess());
                  router.push("/");
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Submit a Complaint
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Please provide details about your complaint.
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearComplaintError())}
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Select
              label="Category"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              options={categories}
            />

            <Input
              label="Title"
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Specific title of the issue"
            />

            <Textarea
              label="Description"
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide a detailed description of your complaint"
              rows={5}
            />

            <div>
              <Button type="submit" isLoading={loading}>
                Submit Complaint
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
