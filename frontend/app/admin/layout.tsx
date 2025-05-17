import type React from "react"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Footer } from "@/components/footer"
import { AdminAuthGuard } from "@/components/auth/admin-auth-guard"
import { FeatureVerification } from "@/components/system/feature-verification"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-6">
            <FeatureVerification />
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AdminAuthGuard>
  )
}
