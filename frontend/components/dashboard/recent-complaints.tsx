"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import { formatDistanceToNow } from "date-fns"

export function RecentComplaints() {
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const router = useRouter()

  // Get the 5 most recent complaints
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Complaints</CardTitle>
        <CardDescription>Your most recently submitted complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{complaint.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ComplaintStatusBadge status={complaint.status} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/complaints/${complaint.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No complaints submitted yet</p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/new-complaint")}>
                Submit your first complaint
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
