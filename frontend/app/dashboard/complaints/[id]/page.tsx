import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ComplaintDetails } from "@/components/complaints/complaint-details"
import { ComplaintTimeline } from "@/components/complaints/complaint-timeline"
import { ComplaintResponses } from "@/components/complaints/complaint-responses"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ComplaintDetail({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Complaint Details" description="View detailed information about your complaint" />

      <Suspense fallback={<LoadingSpinner />}>
        <ComplaintDetails id={params.id} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <ComplaintResponses id={params.id} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <ComplaintTimeline id={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
