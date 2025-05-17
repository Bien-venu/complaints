import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ComplaintForm } from "@/components/complaints/complaint-form"

export default function NewComplaint() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Submit New Complaint" description="Fill out the form below to submit a new complaint" />
      <ComplaintForm />
    </div>
  )
}
