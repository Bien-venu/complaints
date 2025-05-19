"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { register, clearError } from "@/redux/slices/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

const provinces = [{ value: "Kigali", label: "Kigali" }];

const districts = {
  Kigali: [{ value: "Gasabo", label: "Gasabo" }],
};

const sectors = {
  Gasabo: [{ value: "Remera", label: "Remera" }],
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    province: "Kigali",
    district: "Gasabo",
    sector: "Remera",
  });

  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    
    if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        district: districts[value as keyof typeof districts]?.[0]?.value || "",
        sector: "",
      }));
    }

    
    if (name === "district") {
      setFormData((prev) => ({
        ...prev,
        sector: sectors[value as keyof typeof sectors]?.[0]?.value || "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "citizen" as const,
      assignedLocation: {
        province: formData.province || "Kigali",
        district: formData.district || "Gasabo",
        sector: formData.sector || "Remera",
      },
    };

    const resultAction = await dispatch(register(registrationData));

    if (register.fulfilled.match(resultAction)) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
              options={
                districts[formData.province as keyof typeof districts] || []
              }
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
          </div>

          <div>
            <Button type="submit" isLoading={loading} className="w-full">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
