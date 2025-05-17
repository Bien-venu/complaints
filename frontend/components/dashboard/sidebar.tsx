"use client"
import { usePathname } from "next/navigation"
import { RoleBasedNavigation } from "@/components/admin/role-based-navigation"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col h-full overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col border-r bg-muted/30 h-full overflow-hidden ">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 h-full overflow-hidden">
          <nav className="mt-5 flex-1 space-y-1 px-2 h-full overflow-hidden ">
            <RoleBasedNavigation />
          </nav>
        </div>
      </div>
    </div>
  );
}
