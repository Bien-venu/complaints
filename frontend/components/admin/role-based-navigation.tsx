"use client"

import { useSelector } from "react-redux"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, BarChart3, Globe, Building2 } from "lucide-react"
import type { RootState } from "@/lib/store"

export function RoleBasedNavigation() {
  const { currentRole, adminInfo } = useSelector((state: RootState) => state.role)
  const pathname = usePathname()

  // Define navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ]

    if (currentRole === "super") {
      return [
        ...baseItems,
        {
          name: "Escalated Complaints",
          href: "/dashboard/escalated",
          icon: FileText,
        },
        {
          name: "District Admins",
          href: "/dashboard/district-admins",
          icon: Building2,
        },
        {
          name: "Analytics",
          href: "/dashboard/analytics",
          icon: BarChart3,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ]
    } else if (currentRole === "district") {
      return [
        ...baseItems,
        {
          name: "District Complaints",
          href: "/dashboard/district-complaints",
          icon: FileText,
        },
        {
          name: "Sector Admins",
          href: "/dashboard/sector-admins",
          icon: Globe,
        },
        {
          name: "Analytics",
          href: "/dashboard/analytics",
          icon: BarChart3,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ]
    } else if (currentRole === "sector") {
      return [
        ...baseItems,
        {
          name: "Sector Complaints",
          href: "/dashboard/sector-complaints",
          icon: FileText,
        },
        {
          name: "Citizens",
          href: "/dashboard/citizens",
          icon: Users,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ]
    } else {
      return [
        ...baseItems,
        {
          name: "My Complaints",
          href: "/dashboard/complaints",
          icon: FileText,
        },
        {
          name: "New Complaint",
          href: "/dashboard/new-complaint",
          icon: FileText,
        },
        {
          name: "Profile",
          href: "/dashboard/profile",
          icon: Users,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ]
    }
  }

  const navigationItems = getNavigationItems()

  console.log(currentRole);

  return (
    <div className="space-y-1 ">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            pathname === item.href
              ? "bg-[#157037]/10 text-[#157037]"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              pathname === item.href
                ? "text-[#157037]"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
      {currentRole === "citizen" && (
        <div className="pt-4 mt-4 border-t border-2 text-black border-red-600 border-gray-200">
          <div className="px-2 text-xs font-semibold  uppercase tracking-wider">
            {currentRole === "super" && "Super Admin"}
            {currentRole === "district" && adminInfo?.district}
            {currentRole === "sector" && adminInfo?.sector}
            {currentRole === "sector" && adminInfo?.sector}
          </div>
        </div>
      )}
    </div>
  );
}
