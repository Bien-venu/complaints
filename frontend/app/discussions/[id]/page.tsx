"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchDiscussionById,
  addComment,
  resolveDiscussion,
  clearDiscussionError,
} from "@/redux/slices/discussionsSlice";
import { MainLayout } from "@/components/layout/main-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentDiscussion, loading, error } = useAppSelector(
    (state) => state.discussions
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscussionById(id as string));
    }
  }, [dispatch, id]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    const commentData = {
      text: commentText,
      isOfficialResponse: [
        "sector_admin",
        "district_admin",
        "super_admin",
      ].includes(user?.role || ""),
    };

    try {
      await dispatch(addComment({ discussionId: id as string, commentData }));
      setCommentText("");
      dispatch(fetchDiscussionById(id as string));
    } catch (error) {
      console.error("Failed to submit comment:", error);
      
      
    }
  };
  
const handleResolveDiscussion = async () => {
  try {
    await dispatch(resolveDiscussion(id as string));
    dispatch(fetchDiscussionById(id as string));
  } catch (error) {
    console.error("Failed to resolve discussion:", error);
  }
};

  const isAdmin = ["sector_admin", "district_admin", "super_admin"].includes(
    user?.role || ""
  );
  const canResolve = isAdmin && currentDiscussion?.status === "open";

  if (loading && !currentDiscussion) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!currentDiscussion) {
    return (
      <MainLayout requireAuth={true}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center text-gray-500">
            {error || "Discussion not found"}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {currentDiscussion.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                currentDiscussion.status === "open"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {currentDiscussion.status}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Started by {currentDiscussion.createdBy.name} on{" "}
            {new Date(currentDiscussion.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex space-x-2">
            {currentDiscussion.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-md bg-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-900 whitespace-pre-line">
            {currentDiscussion.description}
          </p>
        </div>

        {error && (
          <div className="px-4 py-3">
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearDiscussionError())}
            />
          </div>
        )}

        {canResolve && (
          <div className="border-t border-gray-200 px-4 py-3">
            <Button
              variant="success"
              onClick={handleResolveDiscussion}
              isLoading={loading}
            >
              Resolve Discussion
            </Button>
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900">Comments</h4>

          {currentDiscussion.comments.length === 0 ? (
            <p className="mt-2 text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {currentDiscussion.comments.map((comment) => (
                <li
                  key={comment._id}
                  className={`p-4 rounded-lg ${
                    comment.isOfficialResponse
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        {comment.user.name}
                      </span>
                      {comment.isOfficialResponse && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Official Response
                        </span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">
                        {comment.user.role}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-900">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}

          {currentDiscussion.status === "open" && (
            <form className="mt-6" onSubmit={handleSubmitComment}>
              <Textarea
                label="Add a comment"
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                rows={3}
                required
              />
              <div className="mt-2">
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
