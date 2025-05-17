"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PendingComplaints() {
  const { complaints } = useSelector((state: RootState) => state.complaints)

  // Get pending complaints and sort by creation date (newest first)
  const pendingComplaints = complaints
    .filter((c) => c.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) // Only show 5 most recent

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Complaints</CardTitle>
          <CardDescription>Complaints awaiting your response</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/complaints">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {pendingComplaints.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No pending complaints</p>
        ) : (
          <div className="space-y-4">
            {pendingComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{complaint.title}</h3>
                    <ComplaintStatusBadge status={complaint.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.category}
                  </p>
                </div>
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/admin/complaints/${complaint.id}`}>
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">View complaint</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
