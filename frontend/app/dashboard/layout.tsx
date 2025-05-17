import type React from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/footer";
import { AuthGuard } from "@/components/auth/auth-guard";
import { FeatureVerification } from "@/components/system/feature-verification";
import { FeatureTour } from "@/components/system/feature-tour";
import { MobileNav } from "@/components/mobile-nav";
import { UserNav } from "@/components/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden flex flex-col">
        <div className="flex flex-1 h-full overflow-hidden">
          <Sidebar />
          <main className="flex-1 h-full overflow-hidden ">
            <div className="flex border w-full p-4 justify-end">
              <UserNav />
            </div>
            <div className="flex-1 p-4 md:p-6 h-full overflow-auto ">
              <div className="md:hidden mb-4">
                <MobileNav />
              </div>
              <FeatureVerification />
              {children}
            </div>
          </main>
        </div>
        <FeatureTour />
      </div>
    </AuthGuard>
  );
}
