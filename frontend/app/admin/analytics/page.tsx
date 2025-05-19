"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchFeedbackAnalytics } from "@/redux/slices/feedbackSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { Alert } from "@/components/ui/alert"

export default function Analytics() {
  const { analytics, loading, error } = useAppSelector((state) => state.feedback)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchFeedbackAnalytics())
  }, [dispatch])

  return (
    <MainLayout requireAuth={true} allowedRoles={["super_admin"]}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Feedback Analytics</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View analytics and insights from citizen feedback.</p>
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
          ) : analytics.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">No feedback analytics available.</div>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.map((item) => (
                  <div key={item.serviceType} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 capitalize">{item.serviceType}</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Average Rating</p>
                        <p className="text-xl font-semibold text-blue-600">{item.averageRating.toFixed(1)}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Feedback</p>
                        <p className="text-xl font-semibold text-blue-600">{item.count}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Latest Comments</p>
                      <ul className="mt-2 space-y-2">
                        {item.latestComments.map((comment, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-white p-2 rounded">
                            {comment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
