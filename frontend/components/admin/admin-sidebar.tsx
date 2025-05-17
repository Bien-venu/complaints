"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, FileText, Home, Settings, Users } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function AdminSidebar() {
  const pathname = usePathname()
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const pendingCount = complaints.filter((c) => c.status === "pending").length

  return (
    <div className="hidden border-r bg-white md:block w-64">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Admin Portal</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/admin" ? "default" : "ghost"}
              className={
                pathname === "/admin"
                  ? "bg-[#157037] hover:bg-[#157037]/90 w-full justify-start"
                  : "w-full justify-start"
              }
            >
              <Link href="/admin">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname.startsWith("/admin/complaints") ? "default" : "ghost"}
              className={
                pathname.startsWith("/admin/complaints")
                  ? "bg-[#157037] hover:bg-[#157037]/90 w-full justify-start"
                  : "w-full justify-start"
              }
            >
              <Link href="/admin/complaints" className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Complaints
                </div>
                {pendingCount > 0 && <Badge variant="destructive">{pendingCount}</Badge>}
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/admin/citizens" ? "default" : "ghost"}
              className={
                pathname === "/admin/citizens"
                  ? "bg-[#157037] hover:bg-[#157037]/90 w-full justify-start"
                  : "w-full justify-start"
              }
            >
              <Link href="/admin/citizens">
                <Users className="mr-2 h-4 w-4" />
                Citizens
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/admin/analytics" ? "default" : "ghost"}
              className={
                pathname === "/admin/analytics"
                  ? "bg-[#157037] hover:bg-[#157037]/90 w-full justify-start"
                  : "w-full justify-start"
              }
            >
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/admin/settings" ? "default" : "ghost"}
              className={
                pathname === "/admin/settings"
                  ? "bg-[#157037] hover:bg-[#157037]/90 w-full justify-start"
                  : "w-full justify-start"
              }
            >
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
