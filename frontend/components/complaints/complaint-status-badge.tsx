import { Badge } from "@/components/ui/badge"

interface ComplaintStatusBadgeProps {
  status: string
}

export function ComplaintStatusBadge({ status }: ComplaintStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800"
        >
          Pending
        </Badge>
      )
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500 border-blue-200 dark:border-blue-800"
        >
          In Progress
        </Badge>
      )
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 border-green-200 dark:border-green-800"
        >
          Resolved
        </Badge>
      )
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500 border-red-200 dark:border-red-800"
        >
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }
}
