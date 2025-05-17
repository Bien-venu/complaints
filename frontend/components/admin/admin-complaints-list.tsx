"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { useState } from "react"

export function AdminComplaintsList() {
  const { complaints, filter } = useSelector((state: RootState) => state.complaints)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Filter complaints based on current filter settings
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filter.status === "all" || complaint.status === filter.status
    const matchesCategory = filter.category === "all" || complaint.category === filter.category
    const matchesSearch =
      filter.search === "" ||
      complaint.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filter.search.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
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
      {paginatedComplaints.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Clock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No complaints found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">No complaints match your current filter settings.</p>
          <Button onClick={() => setPage(1)}>Clear filters</Button>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-5">Complaint</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {paginatedComplaints.map((complaint) => (
                <div key={complaint.id} className="grid grid-cols-12 items-center p-4">
                  <div className="col-span-5 font-medium">{complaint.title}</div>
                  <div className="col-span-2 capitalize">{complaint.category.replace("-", " ")}</div>
                  <div className="col-span-2">
                    <ComplaintStatusBadge status={complaint.status} />
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/complaints/${complaint.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View complaint</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
