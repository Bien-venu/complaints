import { AdminComplaintDetails } from "@/components/admin/admin-complaint-details"
import { AdminResponseForm } from "@/components/admin/admin-response-form"
import { ComplaintTimeline } from "@/components/complaints/complaint-timeline"
import { Card } from "@/components/ui/card"

export default function AdminComplaintPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <AdminComplaintDetails id={params.id} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Complaint Timeline</h2>
          <ComplaintTimeline complaintId={params.id} />
        </Card>
        <AdminResponseForm complaintId={params.id} />
      </div>
    </div>
  )
}
