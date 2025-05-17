"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { CheckCircle, Clock, MessageSquare, AlertCircle, FileText } from "lucide-react"

export function ComplaintTimeline({ complaintId }: { complaintId: string }) {
  const complaint = useSelector((state: RootState) => state.complaints.complaints.find((c) => c.id === complaintId))

  if (!complaint) {
    return <div>Complaint not found</div>
  }

  const timelineEvents = [
    {
      id: `${complaint.id}-created`,
      type: "created",
      title: "Complaint Submitted",
      description: "Your complaint has been successfully submitted.",
      date: complaint.createdAt,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      id: `${complaint.id}-categorized`,
      type: "categorized",
      title: "Complaint Categorized",
      description: `Your complaint was categorized as "${complaint.category.replace("-", " ")}"`,
      date: new Date(new Date(complaint.createdAt).getTime() + 1000 * 60 * 5).toISOString(),
      icon: <Clock className="h-5 w-5 text-purple-500" />,
    },
    {
      id: `${complaint.id}-routed`,
      type: "routed",
      title: "Complaint Routed",
      description: "Your complaint has been routed to the appropriate department.",
      date: new Date(new Date(complaint.createdAt).getTime() + 1000 * 60 * 30).toISOString(),
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    },
    ...complaint.responses.map((response) => ({
      id: response.id,
      type: "response",
      title: `Response from ${response.responder}`,
      description: response.content,
      date: response.createdAt,
      icon: <MessageSquare className="h-5 w-5 text-[#157037]" />,
    })),
  ]

  if (complaint.status === "in-progress") {
    timelineEvents.push({
      id: `${complaint.id}-in-progress`,
      type: "status",
      title: "In Progress",
      description: "Your complaint is being addressed by the relevant department.",
      date: complaint.updatedAt,
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    })
  } else if (complaint.status === "resolved") {
    timelineEvents.push({
      id: `${complaint.id}-resolved`,
      type: "status",
      title: "Resolved",
      description: "Your complaint has been resolved.",
      date: complaint.updatedAt,
      icon: <CheckCircle className="h-5 w-5 text-[#157037]" />,
    })
  }

  const sortedEvents = [...timelineEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-4">
      {sortedEvents.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">No timeline events</p>
      ) : (
        <div className="space-y-8">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-8">
              {index !== sortedEvents.length - 1 && (
                <div className="absolute left-[10px] top-[20px] h-full w-[2px] bg-muted" />
              )}

              <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center">{event.icon}</div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <time className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</time>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
