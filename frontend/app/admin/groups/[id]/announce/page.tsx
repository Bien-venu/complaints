"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchGroupById,
  createAnnouncement,
  clearGroupError,
  resetSuccess,
  fetchGroupMembers,
} from "@/redux/slices/groupsSlice";
import { sendMessage } from "@/redux/slices/messagesSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Combobox } from "@/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("announcement");
  const [recipientId, setRecipientId] = useState("");

  const {
    currentGroup,
    groupMembers,
    loading: groupLoading,
    error: groupError,
    success: groupSuccess,
  } = useAppSelector((state) => state.groups);
  const {
    loading: messageLoading,
    error: messageError,
    success: messageSuccess,
  } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loading = groupLoading || messageLoading;
  const error = groupError || messageError;
  const success = groupSuccess || messageSuccess;

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id as string));
      dispatch(fetchGroupMembers(id as string));
    }
  }, [dispatch, id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (messageType === "announcement") {
      await dispatch(
        createAnnouncement({
          groupId: id as string,
          announcementData: { message },
        })
      );
      dispatch(fetchGroupById(id as string));
    } else {
      if (!recipientId) return;

      if (!messageError) {
        setMessage("");
      }
    }
  };

  if (success) {
    return (
      <MainLayout
        requireAuth={true}
        allowedRoles={["sector_admin", "district_admin", "super_admin"]}
      >
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {messageType === "announcement"
                ? "Announcement Posted Successfully"
                : "Message Sent Successfully"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {messageType === "announcement"
                ? "Your announcement has been posted to the group."
                : "Your message has been sent to the recipient."}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  dispatch(resetSuccess());
                  router.push(`/admin/groups/${id}`);
                }}
              >
                View Group
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {currentGroup.name} - Communication
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Send announcements or messages to group members.
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearGroupError())}
            />
          )}

          <Tabs
            defaultValue="announcement"
            className="w-full"
            onValueChange={setMessageType}
          >
            <TabsList className="grid w-full grid-cols-1 mb-6">
              <TabsTrigger value="announcement">Group Announcement</TabsTrigger>
            </TabsList>

            <TabsContent value="announcement">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Textarea
                  label="Announcement Message"
                  id="message"
                  name="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your announcement message here..."
                  rows={5}
                />

                <div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    disabled={!message.trim()}
                  >
                    Post Announcement
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
