"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGroups, joinGroup } from "@/redux/slices/groupsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Users, Bell } from "lucide-react";

export default function AdminGroups() {
  const { groups, loading, error } = useAppSelector((state) => state.groups);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { currentGroup, groupMembers } = useAppSelector(
    (state) => state.groups
  );

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  const handleJoinGroup = async () => {
    if (user && typeof user.id === "string" && user.id.trim() !== "") {
      const resultAction = await dispatch(joinGroup(user.id));
    } else {
      console.error("User ID is not available or invalid, cannot join group.");
    }
  };

  const isUserInGroup = (groupId: string) => {
    const group = groups.find((g) => g._id === groupId);
    return group?.members.some((m) => m.user === user?.id);
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
              Manage Groups
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage groups in your jurisdiction.
            </p>
          </div>
          <Link href="/admin/groups/create">
            <Button>Create Group</Button>
          </Link>
        </div>

        <div className="border-t border-gray-200">
          {error && (
            <div className="px-4 py-5 sm:p-6">
              <Alert type="error" message={error} />
            </div>
          )}

          {loading ? (
            <div className="px-4 py-5 sm:p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No groups found. Create a new group to get started.
            </div>
          ) : (
            <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => {
                const userIsMember = isUserInGroup(group._id);

                return (
                  <div
                    key={group._id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-medium text-blue-600 hover:underline">
                          {group.name}
                        </h2>
                        {userIsMember && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg
                              className="mr-1.5 h-2 w-2 text-green-400"
                              fill="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            Member
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {group.description}
                      </p>

                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{group.members.length} members</span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Created on{" "}
                        {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 border-t">
                      {userIsMember ? (
                        <div className="flex flex-col space-y-2">
                          <Link
                            href={`/admin/groups/${group._id}`}
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              className="w-full flex items-center justify-center"
                            >
                              View Details
                            </Button>
                          </Link>
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/groups/${group._id}/announce`}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full flex items-center justify-center"
                              >
                                <Bell className="h-4 w-4 mr-1" />
                                Announce
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/groups/${group._id}/members`}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full flex items-center justify-center"
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Members
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleJoinGroup} 
                          isLoading={loading} 
                          className="w-full"
                          disabled={!user || !user.id} 
                        >
                          Join Group
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
