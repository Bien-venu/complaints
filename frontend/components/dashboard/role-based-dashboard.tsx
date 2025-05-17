"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"
import { DistrictAdminDashboard } from "@/components/admin/district-admin-dashboard"
import { SectorAdminDashboard } from "@/components/admin/sector-admin-dashboard"
import { CitizenDashboard } from "@/components/dashboard/citizen-dashboard"
import type { RootState } from "@/lib/store"

export function RoleBasedDashboard() {
  const { currentRole, adminInfo } = useSelector((state: RootState) => state.role)
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {currentRole === "super" && "Super Admin Dashboard"}
          {currentRole === "district" && "District Admin Dashboard"}
          {currentRole === "sector" && "Sector Admin Dashboard"}
          {currentRole === "citizen" && "Citizen Dashboard"}
        </CardTitle>
        <CardDescription>
          {currentRole === "super" && "Manage the entire complaint system"}
          {currentRole === "district" && `Manage complaints for ${adminInfo?.district || "your district"}`}
          {currentRole === "sector" && `Manage complaints for ${adminInfo?.sector || "your sector"}`}
          {currentRole === "citizen" && "Track and manage your complaints"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            {currentRole !== "citizen" && <TabsTrigger value="management">Management</TabsTrigger>}
            {currentRole === "citizen" && <TabsTrigger value="history">History</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {currentRole === "super" && <SuperAdminDashboard />}
            {currentRole === "district" && <DistrictAdminDashboard />}
            {currentRole === "sector" && <SectorAdminDashboard />}
            {currentRole === "citizen" && <CitizenDashboard />}
          </TabsContent>

          <TabsContent value="complaints" className="mt-4">
            <ComplaintsTab role={currentRole} adminInfo={adminInfo} />
          </TabsContent>

          {currentRole !== "citizen" && (
            <TabsContent value="management" className="mt-4">
              <ManagementTab role={currentRole} adminInfo={adminInfo} />
            </TabsContent>
          )}

          {currentRole === "citizen" && (
            <TabsContent value="history" className="mt-4">
              <HistoryTab userId={user?.id} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ComplaintsTab({ role, adminInfo }: { role: string; adminInfo: any }) {
  const { complaints } = useSelector((state: RootState) => state.complaints)

  // Filter complaints based on role and admin info
  const filteredComplaints = complaints.filter((complaint) => {
    if (role === "super") {
      return complaint.escalationLevel === "super"
    } else if (role === "district") {
      return (
        complaint.district === adminInfo?.district &&
        (complaint.escalationLevel === "district" || complaint.assignedTo === adminInfo?.id)
      )
    } else if (role === "sector") {
      return complaint.sector === adminInfo?.sector && complaint.assignedTo === adminInfo?.id
    }
    return false
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {role === "super" && "Escalated Complaints"}
        {role === "district" && "District Complaints"}
        {role === "sector" && "Sector Complaints"}
      </h3>

      {filteredComplaints.length === 0 ? (
        <p className="text-muted-foreground">No complaints to display.</p>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{complaint.title}</CardTitle>
                <CardDescription>
                  {complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{complaint.description.substring(0, 150)}...</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {complaint.sector}, {complaint.district}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : complaint.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : complaint.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ManagementTab({ role, adminInfo }: { role: string; adminInfo: any }) {
  const { assignedAdmins } = useSelector((state: RootState) => state.role)

  // Filter admins based on role
  const filteredAdmins = assignedAdmins.filter((admin) => {
    if (role === "super") {
      return admin.role === "district"
    } else if (role === "district") {
      return admin.role === "sector" && admin.district === adminInfo?.district
    }
    return false
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {role === "super" && "District Admins"}
        {role === "district" && "Sector Admins"}
      </h3>

      {filteredAdmins.length === 0 ? (
        <p className="text-muted-foreground">No admins to display.</p>
      ) : (
        <div className="space-y-4">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{admin.name}</CardTitle>
                <CardDescription>{admin.role === "district" ? "District Admin" : "Sector Admin"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {admin.role === "district" && <p>District: {admin.district}</p>}
                  {admin.role === "sector" && (
                    <>
                      <p>District: {admin.district}</p>
                      <p>Sector: {admin.sector}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function HistoryTab({ userId }: { userId?: string }) {
  const { complaints } = useSelector((state: RootState) => state.complaints)

  // In a real app, we would filter by user ID
  // For demo purposes, just show all complaints
  const userComplaints = complaints

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Complaint History</h3>

      {userComplaints.length === 0 ? (
        <p className="text-muted-foreground">You haven't submitted any complaints yet.</p>
      ) : (
        <div className="space-y-4">
          {userComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{complaint.title}</CardTitle>
                <CardDescription>
                  {complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{complaint.description.substring(0, 150)}...</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {complaint.sector}, {complaint.district}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : complaint.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : complaint.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
