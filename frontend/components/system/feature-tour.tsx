"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePathname } from "next/navigation"
import { PlusCircle, BarChart3, MessageSquare, Clock, Sparkles, FileText, CheckCircle2 } from "lucide-react"

export function FeatureTour() {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const tourSeen = localStorage.getItem("featureTourSeen")
    if (tourSeen) {
      setHasSeenTour(true)
    }
  }, [])

  useEffect(() => {
    if (pathname === "/dashboard" && !hasSeenTour) {
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pathname, hasSeenTour])

  const steps = [
    {
      title: "Welcome to CitizenConnect",
      description: "Let's take a quick tour of the key features available to you.",
      icon: MessageSquare,
      color: "text-[#157037]",
      bgColor: "bg-green-100",
    },
    {
      title: "Submit Complaints",
      description:
        "Easily submit complaints with our intuitive form. Our AI will help categorize your complaint automatically.",
      icon: PlusCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Track Status",
      description: "Monitor the progress of your complaints in real-time with our status tracking system.",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "View Complaint Details",
      description: "Access detailed information about each complaint, including timeline and official responses.",
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Receive Responses",
      description: "Get official responses from government agencies directly within the platform.",
      icon: MessageSquare,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Dashboard Analytics",
      description: "View statistics and insights about your complaints to track resolution patterns.",
      icon: BarChart3,
      color: "text-[#157037]",
      bgColor: "bg-green-100",
    },
    {
      title: "Complaint Resolution",
      description: "See when your complaints are resolved and provide feedback on the resolution.",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    setOpen(false)
    localStorage.setItem("featureTourSeen", "true")
    setHasSeenTour(true)
  }

  const handleSkip = () => {
    setOpen(false)
    localStorage.setItem("featureTourSeen", "true")
    setHasSeenTour(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-md"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Feature Tour
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${currentStepData.bgColor}`}>
                <currentStepData.icon className={`h-5 w-5 ${currentStepData.color}`} />
              </div>
              <DialogTitle>{currentStepData.title}</DialogTitle>
            </div>
            <DialogDescription>{currentStepData.description}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-[#157037]" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              {currentStep > 0 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSkip}>
                  Skip Tour
                </Button>
              )}
            </div>
            <Button onClick={handleNext} className="bg-[#157037] hover:bg-[#157037]/90">
              {currentStep < steps.length - 1 ? "Next" : "Finish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
