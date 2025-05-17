"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

export function ComplaintsList() {
  const { complaints, filter } = useSelector((state: RootState) => state.complaints)
  const router = useRouter()
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Apply filters
  const filteredComplaints = complaints.filter((complaint) => {
    if (filter.status && filter.status !== "all" && complaint.status !== filter.status) {
      return false
    }
    if (filter.category && filter.category !== "all" && complaint.category !== filter.category) {
      return false
    }
    if (filter.search && !complaint.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    return true
  })

  // Sort by date (newest first)
  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Paginate
  const totalPages = Math.ceil(sortedComplaints.length / itemsPerPage)
  const paginatedComplaints = sortedComplaints.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedComplaints.length > 0 ? (
              paginatedComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.title}</TableCell>
                  <TableCell>{complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</TableCell>
                  <TableCell>
                    <ComplaintStatusBadge status={complaint.status} />
                  </TableCell>
                  <TableCell>{format(new Date(complaint.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/dashboard/complaints/${complaint.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="icon" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
}
