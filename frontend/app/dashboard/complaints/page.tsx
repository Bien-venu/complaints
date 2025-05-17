import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ComplaintsList } from "@/components/complaints/complaints-list"
import { ComplaintFilters } from "@/components/complaints/complaint-filters"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Complaints() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="My Complaints" description="View and track all your submitted complaints" />

      <ComplaintFilters />

      <Suspense fallback={<LoadingSpinner />}>
        <ComplaintsList />
      </Suspense>
    </div>
  )
}
