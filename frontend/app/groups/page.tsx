"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGroups, joinGroup } from "@/redux/slices/groupsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Users, Bell, Calendar } from "lucide-react";

export default function CitizenGroups() {
  const { groups, loading, error } = useAppSelector((state) => state.groups);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

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
    <MainLayout requireAuth={true} allowedRoles={["citizen"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Community Groups
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Join groups in your community to receive announcements and updates.
          </p>
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
              No groups available in your area yet.
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
                        {userIsMember ? (
                          <Link
                            href={`/groups/${group._id}/announcements`}
                            className="text-lg font-medium text-blue-600 hover:underline"
                          >
                            {group.name}
                          </Link>
                        ) : (
                          <h2 className="text-lg font-medium text-blue-600 hover:underline">
                            {group.name}
                          </h2>
                        )}

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

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Bell className="h-4 w-4 mr-1" />
                        <span>{group.announcements.length} announcements</span>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Created on{" "}
                          {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 border-t">
                      {userIsMember ? (
                        <Link
                          href={`/groups/${group._id}/announcements`}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            className="w-full flex items-center justify-center"
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            View Announcements
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleJoinGroup}
                          isLoading={loading}
                          className="w-full"
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
