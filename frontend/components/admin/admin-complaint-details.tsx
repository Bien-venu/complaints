"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { updateComplaint } from "@/lib/features/complaints/complaintsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function AdminComplaintDetails({ id }: { id: string }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === id))

  const [status, setStatus] = useState(complaint?.status || "pending")
  const [isUpdating, setIsUpdating] = useState(false)

  if (!complaint) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Complaint not found</p>
        </CardContent>
      </Card>
    )
  }

  const handleStatusChange = async () => {
    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(
        updateComplaint({
          id: complaint.id,
          complaint: { status },
        }),
      )

      toast({
        title: "Status updated",
        description: `Complaint status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl">{complaint.title}</CardTitle>
            <CardDescription>
              Submitted on {new Date(complaint.createdAt).toLocaleDateString()} • ID: {complaint.id}
            </CardDescription>
          </div>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <div className="grid gap-2">
              <label htmlFor="status-select" className="text-sm font-medium">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status-select" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleStatusChange}
              disabled={status === complaint.status || isUpdating}
              className="self-end"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Category</h3>
                <p className="capitalize">{complaint.category.replace("-", " ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <ComplaintStatusBadge status={complaint.status} />
              </div>
              <div>
                <h3 className="text-sm font-medium">Location</h3>
                <p>{complaint.location || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Last Updated</h3>
                <p>{new Date(complaint.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Description</h3>
            <div className="rounded-md bg-muted p-4">
              <p className="whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
