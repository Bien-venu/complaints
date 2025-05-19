"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchGroupById,
  fetchGroupAnnouncements,
  clearGroupError,
} from "@/redux/slices/groupsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Users, Bell } from "lucide-react";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentGroup, announcements, loading, error } = useAppSelector(
    (state) => state.groups
  );
  
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id as string));
      dispatch(fetchGroupAnnouncements(id as string));
    }
  }, [dispatch, id]);

  const isUserInGroup = () => {
    return currentGroup?.members.some((m) => m.user === user?._id);
  };


    
    
    

  if (loading && !currentGroup) {
    return (
      <MainLayout
        requireAuth={true}
        allowedRoles={["sector_admin", "district_admin", "super_admin"]}
      >
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!currentGroup) {
    return (
      <MainLayout
        requireAuth={true}
        allowedRoles={["sector_admin", "district_admin", "super_admin"]}
      >
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center text-gray-500">
            {error || "Group not found"}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      requireAuth={true}
      allowedRoles={["sector_admin", "district_admin", "super_admin"]}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {currentGroup.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {currentGroup.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/admin/groups/${id}/members`}>
              <Button variant="secondary" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Members
              </Button>
            </Link>
            <Link href={`/admin/groups/${id}/announce`}>
              <Button className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Announce
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Group Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-500">Location</h5>
              <p className="mt-1 text-sm text-gray-900">
                {currentGroup.location?.sector},{" "}
                {currentGroup.location?.district},{" "}
                {currentGroup.location?.province}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500">Created On</h5>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(currentGroup.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500">Members</h5>
              <p className="mt-1 text-sm text-gray-900">
                {currentGroup.members.length} members
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500">
                Announcements
              </h5>
              <p className="mt-1 text-sm text-gray-900">
                {currentGroup.announcements.length} announcements
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-medium text-gray-900">Announcements</h4>
            {isUserInGroup() && (
              <Link href={`/admin/groups/${id}/announce`}>
                <Button size="sm" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </Link>
            )}
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
            <p className="text-center text-gray-500 py-4">
              No announcements yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {announcements.map((announcement) => (
                <li
                  key={announcement._id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
