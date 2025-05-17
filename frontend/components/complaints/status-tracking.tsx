"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StatusTrackingProps {
  complaintId: string
}

export function StatusTracking({ complaintId }: StatusTrackingProps) {
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === complaintId))

  if (!complaint) {
    return null
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "in-progress":
        return 65
      case "resolved":
        return 100
      case "rejected":
        return 100
      default:
        return 0
    }
  }

  const progressPercentage = getProgressPercentage(complaint.status)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-[#157037]" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getEstimatedCompletion = (status: string) => {
    switch (status) {
      case "pending":
        return "1-2 business days"
      case "in-progress":
        return "3-5 business days"
      case "resolved":
        return "Completed"
      case "rejected":
        return "N/A"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Status Tracking</CardTitle>
            <CardDescription>Real-time status of your complaint</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(complaint.status)}
            <Badge
              variant="outline"
              className={`
                ${complaint.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                ${complaint.status === "in-progress" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                ${complaint.status === "resolved" ? "bg-green-50 text-[#157037] border-green-200" : ""}
                ${complaint.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
              `}
            >
              {complaint.status === "in-progress"
                ? "In Progress"
                : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <div>Submitted</div>
              <div>In Progress</div>
              <div>Resolved</div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Submitted On</div>
              <div>{new Date(complaint.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="font-medium">Last Updated</div>
              <div>{new Date(complaint.updatedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="font-medium">Estimated Completion</div>
              <div>{getEstimatedCompletion(complaint.status)}</div>
            </div>
            <div>
              <div className="font-medium">Department</div>
              <div className="capitalize">{complaint.category.replace("-", " ")} Department</div>
            </div>
          </div>

          {complaint.status === "resolved" && (
            <div className="rounded-md bg-green-50 p-3 text-[#157037]">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <div className="font-medium">Complaint Resolved</div>
              </div>
              <p className="mt-1 text-sm">
                Your complaint has been successfully resolved. Thank you for your patience.
              </p>
            </div>
          )}

          {complaint.status === "rejected" && (
            <div className="rounded-md bg-red-50 p-3 text-red-700">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                <div className="font-medium">Complaint Rejected</div>
              </div>
              <p className="mt-1 text-sm">
                Your complaint has been rejected. Please check the responses for more information.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
