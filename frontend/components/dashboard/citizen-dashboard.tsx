"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import type { RootState } from "@/lib/store"

export function CitizenDashboard() {
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const router = useRouter()

  // Count complaints by status
  const pendingCount = complaints.filter((c) => c.status === "pending").length
  const inProgressCount = complaints.filter((c) => c.status === "in-progress").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length
  const totalCount = complaints.length

  // Calculate percentages
  const pendingPercentage = Math.round((pendingCount / totalCount) * 100) || 0
  const inProgressPercentage = Math.round((inProgressCount / totalCount) * 100) || 0
  const resolvedPercentage = Math.round((resolvedCount / totalCount) * 100) || 0

  // Get most recent complaint
  const recentComplaint = [...complaints].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Complaints you've submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully addressed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Pending</div>
                <div>{pendingPercentage}%</div>
              </div>
              <Progress value={pendingPercentage} className="h-2 bg-yellow-100" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>In Progress</div>
                <div>{inProgressPercentage}%</div>
              </div>
              <Progress value={inProgressPercentage} className="h-2 bg-blue-100" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Resolved</div>
                <div>{resolvedPercentage}%</div>
              </div>
              <Progress value={resolvedPercentage} className="h-2 bg-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/dashboard/new-complaint")}
              className="w-full bg-[#157037] hover:bg-[#157037]/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit New Complaint
            </Button>

            <Button onClick={() => router.push("/dashboard/complaints")} variant="outline" className="w-full">
              View All Complaints
            </Button>

            {recentComplaint && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Most Recent Complaint</h3>
                <div className="text-sm">
                  <p className="font-medium">{recentComplaint.title}</p>
                  <p className="text-muted-foreground">
                    Status: <span className="capitalize">{recentComplaint.status}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Submitted: {new Date(recentComplaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
