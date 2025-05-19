"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserComplaints } from "@/redux/slices/complaintsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Filter,
  Search,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";


const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "status", label: "By Status" },
];

export default function MyComplaints() {
  const { userComplaints, loading, error } = useAppSelector(
    (state) => state.complaints
  );
  const dispatch = useAppDispatch();

  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserComplaints()).then((action) => {
    });
  }, [dispatch]);

  
  const filteredComplaints = Array.isArray(userComplaints)
    ? userComplaints
        .filter((complaint) => {
          
          const matchesSearch =
            searchQuery === "" ||
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (complaint.location.district + " " + complaint.location.sector)
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          
          const matchesStatus =
            statusFilter === "all" || complaint.status === statusFilter;

          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          
          switch (sortBy) {
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "oldest":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "status":
              return a.status.localeCompare(b.status);
            default:
              return 0;
          }
        })
    : [];

  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "escalated":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "in_progress":
        return <Clock className="h-4 w-4 mr-1" />;
      case "escalated":
        return <ArrowUpRight className="h-4 w-4 mr-1" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              My Complaints
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and track the status of your submitted complaints.
            </p>
          </div>
          <Link href="/submit-complaint">
            <Button>Submit New Complaint</Button>
          </Link>
        </div>

        <div className="border-t border-gray-200">
          {error && (
            <div className="px-4 py-5 sm:p-6">
              <Alert type="error" message={error} />
            </div>
          )}

          <div className="px-4 py-5 sm:p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            {isFilterOpen && (
              <div className="mt-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="px-4 py-5 sm:p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "No complaints match your filters."
                : "You haven't submitted any complaints yet."}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="px-4 py-5 sm:p-6 hover:bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {complaint.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            complaint.status
                          )}`}
                        >
                          {getStatusIcon(complaint.status)}
                          {complaint.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                            complaint.status.replace("_", " ").slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Submitted on{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        {complaint.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Location: {complaint.location.sector},{" "}
                        {complaint.location.district}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {complaint.sectorAdmin && (
                        <div className="text-sm">
                          <span className="text-gray-500">Assigned to:</span>
                          <div className="font-medium">
                            {complaint.sectorAdmin.name}
                          </div>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-500">Escalation Level:</span>
                        <div className="font-medium">
                          {complaint.escalationLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
