"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateComplaint } from "@/lib/features/complaints/complaintsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { RootState } from "@/lib/store"

interface ComplaintEscalationProps {
  complaintId: string
}

export function ComplaintEscalation({ complaintId }: ComplaintEscalationProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const { toast } = useToast()
  const { currentRole, adminInfo } = useSelector((state: RootState) => state.role)
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === complaintId))

  if (!complaint) {
    return null
  }

  // Determine if this complaint can be escalated
  const canEscalate =
    (currentRole === "sector" && complaint.status !== "resolved") ||
    (currentRole === "district" && complaint.escalationLevel === "district" && complaint.status !== "resolved")

  // Determine the escalation level
  const getEscalationLevel = () => {
    if (currentRole === "sector") return "district"
    if (currentRole === "district") return "super"
    return null
  }

  // Determine the escalation target
  const getEscalationTarget = () => {
    if (currentRole === "sector") return "District Admin"
    if (currentRole === "district") return "Super Admin"
    return null
  }

  const handleEscalate = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for escalation",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const escalationLevel = getEscalationLevel()

      if (escalationLevel) {
        dispatch(
          updateComplaint({
            id: complaintId,
            complaint: {
              escalationLevel,
              escalationReason: reason,
              updatedAt: new Date().toISOString(),
            },
          }),
        )

        toast({
          title: "Complaint escalated",
          description: `This complaint has been escalated to the ${getEscalationTarget()}`,
        })

        setReason("")
      }
    } catch (error) {
      toast({
        title: "Error escalating complaint",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canEscalate) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalate Complaint</CardTitle>
        <CardDescription>
          Escalate this complaint to the {getEscalationTarget()} if you cannot resolve it at your level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Only escalate complaints that cannot be resolved at your level. Provide a clear reason for escalation.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="escalation-reason" className="text-sm font-medium">
              Reason for Escalation
            </label>
            <Textarea
              id="escalation-reason"
              placeholder="Explain why this complaint needs to be escalated..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleEscalate}
          disabled={isSubmitting || !reason.trim()}
          className="bg-[#157037] hover:bg-[#157037]/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Escalating...
            </>
          ) : (
            <>
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Escalate to {getEscalationTarget()}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
