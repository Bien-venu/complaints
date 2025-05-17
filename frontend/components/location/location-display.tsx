"use client"

import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { RootState } from "@/lib/store"

export function LocationDisplay() {
  const { country, province, district, sector } = useSelector((state: RootState) => state.location)

  if (!country) {
    return null
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-[#157037] mt-0.5" />
          <div>
            <p className="font-medium text-[#157037]">Selected Location:</p>
            <p className="text-sm text-green-800">
              {country}
              {province && ` → ${province}`}
              {district && ` → ${district}`}
              {sector && ` → ${sector}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
