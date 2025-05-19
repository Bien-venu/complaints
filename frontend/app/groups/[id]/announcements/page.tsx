"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchGroupById,
  fetchGroupAnnouncements,
  clearGroupError,
  joinGroup,
} from "@/redux/slices/groupsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, Bell, Calendar } from "lucide-react";

export default function GroupAnnouncements() {
  const { id } = useParams<{ id: string }>();
  const { currentGroup, announcements, loading, error } = useAppSelector(
    (state) => state.groups
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id as string));
      dispatch(fetchGroupAnnouncements(id as string));
    }
  }, [dispatch, id]);

  const handleJoinGroup = async () => {
    if (id) {
      await dispatch(joinGroup(id as string));
    }
  };

  const isUserInGroup = () => {
    return currentGroup?.members.some((m) => m.user?._id === user?.id);
  };

  if (loading && !currentGroup) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!currentGroup) {
    return (
      <MainLayout requireAuth={true}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center text-gray-500">
            {error || "Group not found"}
          </div>
        </div>
      </MainLayout>
    );
  }

  const userIsMember = isUserInGroup();

  return (
    <MainLayout requireAuth={true}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {currentGroup.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {currentGroup.description}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <div className="inline-flex items-center text-xs text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{currentGroup.members.length} members</span>
                </div>

                <div className="inline-flex items-center text-xs text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Created on{" "}
                    {new Date(currentGroup.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="inline-flex items-center text-xs text-gray-500">
                  <Bell className="h-4 w-4 mr-1" />
                  <span>{currentGroup.announcements.length} announcements</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              {userIsMember ? (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    <svg
                      className="mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Member
                  </span>
                </div>
              ) : (
                <Button onClick={handleJoinGroup} isLoading={loading}>
                  Join Group
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-medium text-gray-900">Announcements</h4>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearGroupError())}
            />
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No announcements yet.</p>
              {userIsMember && user?.role !== "citizen" && (
                <div className="mt-4">
                  <Link href={`/admin/groups/${id}/announce`}>
                    <Button size="sm">Post Announcement</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-700">
                        {announcement.postedBy.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">
                            {announcement.postedBy.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {announcement.postedBy.role}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-900 whitespace-pre-line">
                        {announcement.message}
                      </p>
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
