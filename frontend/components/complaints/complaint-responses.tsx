"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

export function ComplaintResponses({ complaintId }: { complaintId: string }) {
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === complaintId))

  if (!complaint) {
    return <div>Complaint not found</div>
  }

  if (complaint.responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No responses yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          When government officials respond to your complaint, their messages will appear here.
        </p>
      </div>
    )
  }

  // Sort responses by date (newest first)
  const sortedResponses = [...complaint.responses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-6">
      {sortedResponses.map((response) => (
        <div key={response.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#157037] text-white">
              {response.responder
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{response.responder}</div>
              <div className="text-xs text-muted-foreground">{new Date(response.createdAt).toLocaleString()}</div>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">{response.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
