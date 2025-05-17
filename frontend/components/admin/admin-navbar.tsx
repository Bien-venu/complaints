"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminUserNav } from "@/components/admin/admin-user-nav"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export function AdminNavbar() {
  const pathname = usePathname()
  const { complaints } = useSelector((state: RootState) => state.complaints)
  const pendingCount = complaints.filter((c) => c.status === "pending").length

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center">
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <Logo />
          <span className="hidden md:inline-block">Admin Portal</span>
        </div>
        <div className="flex-1" />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/admin"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/admin" ? "text-[#157037] font-medium" : "text-foreground/60"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/complaints"
            className={`transition-colors hover:text-foreground/80 flex items-center gap-2 ${
              pathname.startsWith("/admin/complaints") ? "text-[#157037] font-medium" : "text-foreground/60"
            }`}
          >
            Complaints
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </Link>
          <Link
            href="/admin/settings"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/admin/settings" ? "text-[#157037] font-medium" : "text-foreground/60"
            }`}
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
          <AdminUserNav />
        </div>
      </div>
    </header>
  )
}
