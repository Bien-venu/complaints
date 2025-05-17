"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { RootState } from "@/lib/store"

export function SectorAdminDashboard() {
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const { adminInfo } = useSelector((state: RootState) => state.role)

  // Filter complaints for this sector
  const sectorComplaints = complaints.filter((c) => c.sector === adminInfo?.sector && c.assignedTo === adminInfo?.id)

  // Count complaints by status
  const pendingCount = sectorComplaints.filter((c) => c.status === "pending").length
  const inProgressCount = sectorComplaints.filter((c) => c.status === "in-progress").length
  const resolvedCount = sectorComplaints.filter((c) => c.status === "resolved").length
  const totalCount = sectorComplaints.length

  // Calculate percentages
  const pendingPercentage = Math.round((pendingCount / totalCount) * 100) || 0
  const inProgressPercentage = Math.round((inProgressCount / totalCount) * 100) || 0
  const resolvedPercentage = Math.round((resolvedCount / totalCount) * 100) || 0

  // Count complaints by category
  const categories = sectorComplaints.reduce(
    (acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sector Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">In {adminInfo?.sector || "your sector"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Complaints awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Complaints being addressed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Complaints successfully resolved</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Complaints by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="capitalize">{category.replace("-", " ")}</div>
                <div>{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {pendingCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            You have {pendingCount} pending complaint{pendingCount > 1 ? "s" : ""} that require your attention.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
