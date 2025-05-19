"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchDiscussions } from "@/redux/slices/discussionsSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

export default function Discussions() {
  const { discussions, loading, error } = useAppSelector((state) => state.discussions)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchDiscussions())
  }, [dispatch])


  return (
    <MainLayout requireAuth={true}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Discussions</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Join or start discussions about issues in your community.
            </p>
          </div>
          <Link href="/create-discussion">
            <Button>Create Discussion</Button>
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
          ) : discussions.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No discussions found. Be the first to start a discussion!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <li key={discussion._id}>
                  <Link href={`/discussions/${discussion._id}`}>
                    <div className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">{discussion.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                discussion.status === "open"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {discussion.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {discussion.description.length > 100
                                ? `${discussion.description.substring(0, 100)}...`
                                : discussion.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created by {discussion.createdBy.name} on{" "}
                              {new Date(discussion.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex space-x-2">
                            {discussion.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs rounded-md bg-gray-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
