"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchComplaints,
  escalateComplaint,
  resolveComplaint,
} from "@/redux/slices/complaintsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ArrowUpRight,
  CheckCircle,
  Filter,
  Search,
  AlertTriangle,
  Clock,
} from "lucide-react";


const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "sanitation", label: "Sanitation" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "status", label: "By Status" },
  { value: "category", label: "By Category" },
];

export default function AdminComplaints() {
  const { complaints, loading, error } = useAppSelector(
    (state) => state.complaints
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  
  const handleEscalateComplaint = async (complaintId: string) => {
    await dispatch(escalateComplaint(complaintId));
  };

  const handleResolveComplaint = async (complaintId: string) => {
    await dispatch(resolveComplaint(complaintId));
  };

  
  const filteredComplaints = complaints
    .filter((complaint) => {
      
      const matchesSearch =
        searchQuery === "" ||
        complaint.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchQuery.toLowerCase());

      
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;

      
      const matchesCategory =
        categoryFilter === "all" || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  
  const canEscalate = user?.role === "sector_admin";
  const canResolve = ["sector_admin", "district_admin"].includes(
    user?.role || ""
  );

  
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
    <MainLayout
      requireAuth={true}
      allowedRoles={["sector_admin", "district_admin", "super_admin"]}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Manage Complaints
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage citizen complaints in your jurisdiction.
            </p>
          </div>
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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
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
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "No complaints match your filters."
                : "No complaints found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {complaint.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {complaint.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {complaint.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {canEscalate &&
                            complaint.status !== "escalated" &&
                            complaint.status !== "resolved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEscalateComplaint(complaint._id)
                                }
                                className="flex items-center"
                              >
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                Escalate
                              </Button>
                            )}
                          {canResolve && complaint.status !== "resolved" && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleResolveComplaint(complaint._id)
                              }
                              className="flex items-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
