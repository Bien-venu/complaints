"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { login, clearError } from "@/redux/slices/authSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { loading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const resultAction = await dispatch(login(formData))

    if (login.fulfilled.match(resultAction)) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
          </div>

          <div>
            <Button type="submit" isLoading={loading} className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
