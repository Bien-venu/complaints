import { AdminComplaintsHeader } from "@/components/admin/admin-complaints-header"
import { AdminComplaintsList } from "@/components/admin/admin-complaints-list"
import { AdminComplaintFilters } from "@/components/admin/admin-complaint-filters"

export default function AdminComplaints() {
  return (
    <div className="space-y-6">
      <AdminComplaintsHeader />
      <AdminComplaintFilters />
      <AdminComplaintsList />
    </div>
  )
}
