"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function FeatureVerification() {
  const pathname = usePathname()
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [missingFeatures, setMissingFeatures] = useState<string[]>([])
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [relevantFeatures, setRelevantFeatures] = useState([])

  if (!pathname.includes("/dashboard") && !pathname.includes("/admin")) {
    return null
  }

  const requiredFeatures = [
    {
      id: "complaint-submission",
      name: "Complaint Submission",
      path: "/dashboard/new-complaint",
      description: "Submit new complaints with categorization",
    },
    {
      id: "complaint-tracking",
      name: "Status Tracking",
      path: "/dashboard/complaints",
      description: "Track complaint status and updates",
    },
    {
      id: "complaint-dashboard",
      name: "Complaint Dashboard",
      path: "/dashboard",
      description: "Overview of all complaints and their statuses",
    },
    {
      id: "admin-interface",
      name: "Admin Response Interface",
      path: "/admin",
      description: "Interface for admins to respond to complaints",
      adminOnly: true,
    },
  ]

  useEffect(() => {
    let filteredFeatures = requiredFeatures
    if (isAuthenticated) {
      filteredFeatures = requiredFeatures.filter((feature) => !feature.adminOnly || user?.role === "admin")
    }
    setRelevantFeatures(filteredFeatures)
  }, [isAuthenticated, user?.role])

  useEffect(() => {
    const checkFeatures = async () => {
      const missing: string[] = []

      for (const feature of relevantFeatures) {
        const isAccessible = true

        if (!isAccessible) {
          missing.push(feature.id)
        }
      }

      setMissingFeatures(missing)
      setVerificationComplete(true)
    }

    if (isAuthenticated) {
      checkFeatures()
    }
  }, [isAuthenticated, user?.role, relevantFeatures])

  if (!verificationComplete || missingFeatures.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Missing Features Detected</AlertTitle>
      <AlertDescription>
        The following features are not fully accessible:
        <ul className="mt-2 space-y-1">
          {missingFeatures.map((id) => {
            const feature = requiredFeatures.find((f) => f.id === id)
            return feature ? (
              <li key={id} className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{feature.name}</span>
                <Badge variant="outline" className="ml-2">
                  {feature.description}
                </Badge>
                <Button asChild variant="link" size="sm" className="ml-auto">
                  <Link href={feature.path}>Access Now</Link>
                </Button>
              </li>
            ) : null
          })}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
