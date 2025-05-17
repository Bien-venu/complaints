"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { RootState } from "@/lib/store"

export function DistrictAdminDashboard() {
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const { adminInfo } = useSelector((state: RootState) => state.role)

  // Filter complaints for this district
  const districtComplaints = complaints.filter((c) => c.district === adminInfo?.district)

  // Count escalated complaints to district admin
  const escalatedToDistrict = districtComplaints.filter((c) => c.escalationLevel === "district").length

  // Count complaints by status
  const pendingCount = districtComplaints.filter((c) => c.status === "pending").length
  const inProgressCount = districtComplaints.filter((c) => c.status === "in-progress").length
  const resolvedCount = districtComplaints.filter((c) => c.status === "resolved").length
  const totalCount = districtComplaints.length

  // Calculate percentages
  const pendingPercentage = Math.round((pendingCount / totalCount) * 100) || 0
  const inProgressPercentage = Math.round((inProgressCount / totalCount) * 100) || 0
  const resolvedPercentage = Math.round((resolvedCount / totalCount) * 100) || 0

  // Count sectors in this district
  const sectors = [...new Set(districtComplaints.map((c) => c.sector))].length

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">District Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">In {adminInfo?.district || "your district"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated to District</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalatedToDistrict}</div>
            <p className="text-xs text-muted-foreground">Requiring district level attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors}</div>
            <p className="text-xs text-muted-foreground">Active sectors in your district</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedPercentage}%</div>
            <p className="text-xs text-muted-foreground">Of complaints resolved</p>
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

      {escalatedToDistrict > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            You have {escalatedToDistrict} escalated complaint{escalatedToDistrict > 1 ? "s" : ""} that require your
            attention.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
