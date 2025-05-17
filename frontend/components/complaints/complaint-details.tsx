"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import { ComplaintTimeline } from "@/components/complaints/complaint-timeline"
import { ComplaintResponses } from "@/components/complaints/complaint-responses"
import { StatusTracking } from "@/components/complaints/status-tracking"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ComplaintDetails({ id }: { id: string }) {
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === id))

  if (!complaint) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Complaint not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">{complaint.title}</CardTitle>
              <CardDescription>
                Submitted on {new Date(complaint.createdAt).toLocaleDateString()} • ID: {complaint.id}
              </CardDescription>
            </div>
            <ComplaintStatusBadge status={complaint.status} className="mt-2 md:mt-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <p className="capitalize">{complaint.category.replace("-", " ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p>{complaint.location || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Submission Date</h3>
                  <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p>{new Date(complaint.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <div className="rounded-md bg-muted p-4">
                <p className="whitespace-pre-wrap">{complaint.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatusTracking complaintId={id} />

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="responses">Responses ({complaint.responses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Timeline</CardTitle>
              <CardDescription>Track the progress of your complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintTimeline complaintId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Official Responses</CardTitle>
              <CardDescription>Responses from government agencies</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintResponses complaintId={id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
