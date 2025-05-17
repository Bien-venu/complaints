"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setFilter } from "@/lib/features/complaints/complaintsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function ComplaintFilters() {
  const dispatch = useDispatch()
  const { filter } = useSelector((state: RootState) => state.complaints)

  const handleStatusChange = (value: string) => {
    dispatch(setFilter({ ...filter, status: value }))
  }

  const handleCategoryChange = (value: string) => {
    dispatch(setFilter({ ...filter, category: value }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ ...filter, search: e.target.value }))
  }

  const clearFilters = () => {
    dispatch(setFilter({ status: "all", category: "all", search: "" }))
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
      <div className="grid flex-1 gap-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search complaints..."
            className="pl-8"
            value={filter.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <Select value={filter.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status" className="w-full md:w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select value={filter.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="w-full md:w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="infrastructure">Infrastructure</SelectItem>
            <SelectItem value="public-services">Public Services</SelectItem>
            <SelectItem value="sanitation">Sanitation</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="safety">Public Safety</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="icon" onClick={clearFilters} className="md:self-end">
        <X className="h-4 w-4" />
        <span className="sr-only">Clear filters</span>
      </Button>
    </div>
  )
}
