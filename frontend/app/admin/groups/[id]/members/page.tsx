"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGroupById, fetchGroupMembers } from "@/redux/slices/groupsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { MessageCircle } from "lucide-react";

export default function GroupMembers() {
  const { id } = useParams<{ id: string }>();
  const { currentGroup, groupMembers, loading, error } = useAppSelector(
    (state) => state.groups
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id as string));
      dispatch(fetchGroupMembers(id as string));
    }
  }, [dispatch, id]);

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
              {currentGroup.name} - Members
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage members of this group.
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/admin/groups/${id}`}>
              <Button variant="secondary">Back to Group</Button>
            </Link>
            <Link href={`/admin/groups/${id}/announce`}>
              <Button>Add Announcement</Button>
            </Link>
          </div>
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
          ) : groupMembers.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No members found in this group.
            </div>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMembers.map((member) => (
                  <div
                    key={member._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <span className="text-lg font-medium text-gray-700">
                          {member.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {member.user.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.user.role === "super_admin"
                            ? "bg-purple-100 text-purple-800"
                            : member.user.role === "district_admin"
                            ? "bg-blue-100 text-blue-800"
                            : member.user.role === "sector_admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.user.role}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <p>
                       ''
                      </p>
                      <p>Joined: {member.joinedAt}</p>
                    </div>

                    <Link
                      href={`/messages?recipient=${member._id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        className="w-full flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
