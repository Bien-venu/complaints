import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
            Your voice matters. Let it be heard.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            CitizenConnect makes it easy to submit and track your complaints. Get real-time updates and transparent
            responses from government agencies.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-[#157037] hover:bg-[#157037]/90 text-white">
              <Link href="/dashboard/new-complaint">Submit a Complaint</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-gray-300 text-gray-600 hover:text-[#157037]">
              <Link href="/dashboard">Track Complaints</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
