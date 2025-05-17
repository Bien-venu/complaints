import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function AdminDashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and respond to citizen complaints</p>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-0">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
