import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Overview of your complaints and their status" />

      <Suspense fallback={<LoadingSpinner />}>
        <RoleBasedDashboard />
      </Suspense>
    </div>
  )
}
