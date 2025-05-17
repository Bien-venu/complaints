"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, MessageSquare } from "lucide-react"

export function ComplaintStats() {
  const { complaints } = useSelector((state: RootState) => state.complaints)

  // Calculate stats
  const total = complaints.length
  const resolved = complaints.filter((c) => c.status === "resolved").length
  const pending = complaints.filter((c) => c.status === "pending").length
  const inProgress = complaints.filter((c) => c.status === "in-progress").length

  const stats = [
    {
      title: "Total Complaints",
      value: total,
      description: "All complaints submitted",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Resolved",
      value: resolved,
      description: "Successfully addressed",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "In Progress",
      value: inProgress,
      description: "Currently being addressed",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Pending",
      value: pending,
      description: "Awaiting review",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-full`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
