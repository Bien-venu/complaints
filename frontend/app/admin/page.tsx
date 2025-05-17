import { AdminDashboardHeader } from "@/components/admin/admin-dashboard-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { PendingComplaints } from "@/components/admin/pending-complaints"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminDashboardHeader />
      <AdminStats />
      <PendingComplaints />
    </div>
  )
}
