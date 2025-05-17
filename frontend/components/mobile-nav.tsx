"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  FileText,
  PlusCircle,
  BarChart3,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  Mail,
  Bell,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { complaints } = useSelector((state: RootState) => state.complaints)

  const unresolvedCount = complaints.filter((c) => c.status !== "resolved").length

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const publicNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: HelpCircle },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: Mail },
  ]

  const authenticatedNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "My Complaints",
      href: "/dashboard/complaints",
      icon: FileText,
      badge: unresolvedCount > 0 ? unresolvedCount : null,
    },
    {
      name: "New Complaint",
      href: "/dashboard/new-complaint",
      icon: PlusCircle,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 py-4">
          <div className="px-2 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
            <div className="space-y-1">
              {publicNavigation.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={
                    pathname === item.href
                      ? "w-full justify-start bg-[#157037] hover:bg-[#157037]/90"
                      : "w-full justify-start"
                  }
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {isAuthenticated && (
            <div className="px-2 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
              <div className="space-y-1">
                {authenticatedNavigation.map((item) => (
                  <Button
                    key={item.name}
                    asChild
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={
                      pathname === item.href
                        ? "w-full justify-start bg-[#157037] hover:bg-[#157037]/90"
                        : "w-full justify-start"
                    }
                  >
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </div>
                      {item.badge && <Badge variant="destructive">{item.badge}</Badge>}
                    </Link>
                  </Button>
                ))}

                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start border-[#157037] text-[#157037] hover:bg-[#157037]/10"
                  >
                    <Link href="/admin">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Admin Portal
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="px-6 py-2 flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-[#157037] hover:bg-[#157037]/90">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
