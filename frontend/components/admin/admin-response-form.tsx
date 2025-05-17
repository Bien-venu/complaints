"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addResponse, updateComplaint } from "@/lib/features/complaints/complaintsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { RootState } from "@/lib/store"

export function AdminResponseForm({ complaintId }: { complaintId: string }) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [notifyUser, setNotifyUser] = useState(true)
  const [assignedTo, setAssignedTo] = useState("")
  const [priority, setPriority] = useState("medium")

  const dispatch = useDispatch()
  const { toast } = useToast()
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === complaintId))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!response.trim()) {
      toast({
        title: "Response required",
        description: "Please enter a response before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(
        addResponse({
          complaintId,
          response: {
            id: `response-${Date.now()}`,
            content: response,
            responder: "Admin Department",
            createdAt: new Date().toISOString(),
          },
        }),
      )

      if (newStatus && complaint?.status !== newStatus) {
        dispatch(
          updateComplaint({
            id: complaintId,
            complaint: {
              status: newStatus,
              updatedAt: new Date().toISOString(),
            },
          }),
        )
      }

      toast({
        title: "Response submitted",
        description: `Your response has been sent to the citizen${newStatus ? " and status updated" : ""}`,
      })

      setResponse("")
      setNewStatus("")
    } catch (error) {
      toast({
        title: "Error submitting response",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || complaint?.status === newStatus) {
      toast({
        title: "No change",
        description: "Please select a different status",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(
        updateComplaint({
          id: complaintId,
          complaint: {
            status: newStatus,
            updatedAt: new Date().toISOString(),
          },
        }),
      )

      toast({
        title: "Status updated",
        description: `Complaint status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Response Interface</CardTitle>
      </CardHeader>
      <Tabs defaultValue="response">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="response">Send Response</TabsTrigger>
          <TabsTrigger value="manage">Manage Complaint</TabsTrigger>
        </TabsList>

        <TabsContent value="response">
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid gap-4">
                <Textarea
                  placeholder="Enter your response to the citizen..."
                  className="min-h-32"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={isSubmitting}
                />

                <div className="grid gap-2">
                  <Label htmlFor="status-update">Update Status (Optional)</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status-update">
                      <SelectValue placeholder="Keep current status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keep current status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify-user"
                    checked={notifyUser}
                    onCheckedChange={(checked) => setNotifyUser(checked as boolean)}
                  />
                  <Label htmlFor="notify-user">Notify citizen via email</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setResponse("")} disabled={isSubmitting}>
                Clear
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#157037] hover:bg-[#157037]/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Response
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="manage">
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assigned-to">Assign To</Label>
                <Input
                  id="assigned-to"
                  placeholder="Enter department or staff name"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus || complaint?.status || ""} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
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

              <div className="flex items-center space-x-2">
                <Checkbox id="internal-note" checked={true} />
                <Label htmlFor="internal-note">Add to internal notes only (not visible to citizen)</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleStatusUpdate}
              disabled={isSubmitting || !newStatus || complaint?.status === newStatus}
              className="bg-[#157037] hover:bg-[#157037]/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? (
                "Updating..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Complaint
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
