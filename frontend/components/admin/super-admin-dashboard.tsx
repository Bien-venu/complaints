"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { RootState } from "@/lib/store"

export function SuperAdminDashboard() {
  const { complaints } = useSelector((state: RootState) => state.complaints)

  // Count escalated complaints to super admin
  const escalatedToSuper = complaints.filter((c) => c.escalationLevel === "super").length

  // Count complaints by status
  const pendingCount = complaints.filter((c) => c.status === "pending").length
  const inProgressCount = complaints.filter((c) => c.status === "in-progress").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length
  const totalCount = complaints.length

  // Calculate percentages
  const pendingPercentage = Math.round((pendingCount / totalCount) * 100) || 0
  const inProgressPercentage = Math.round((inProgressCount / totalCount) * 100) || 0
  const resolvedPercentage = Math.round((resolvedCount / totalCount) * 100) || 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Across all districts and sectors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated to Super Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalatedToSuper}</div>
            <p className="text-xs text-muted-foreground">Requiring national level attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Districts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active districts in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active sectors in the system</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Resolution Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Pending ({pendingCount})</div>
              <div>{pendingPercentage}%</div>
            </div>
            <Progress value={pendingPercentage} className="h-2 bg-yellow-100" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>In Progress ({inProgressCount})</div>
              <div>{inProgressPercentage}%</div>
            </div>
            <Progress value={inProgressPercentage} className="h-2 bg-blue-100" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Resolved ({resolvedCount})</div>
              <div>{resolvedPercentage}%</div>
            </div>
            <Progress value={resolvedPercentage} className="h-2 bg-green-100" />
          </div>
        </CardContent>
      </Card>

      {escalatedToSuper > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            You have {escalatedToSuper} escalated complaint{escalatedToSuper > 1 ? "s" : ""} that require your
            attention.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
