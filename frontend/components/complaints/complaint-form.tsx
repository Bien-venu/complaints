"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { addComplaint } from "@/lib/features/complaints/complaintsSlice"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MapPin, Upload, Info } from "lucide-react"
import { AICategorySuggestion } from "@/components/complaints/ai-category-suggestion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocationSelector } from "@/components/location/location-selector"
import type { RootState } from "@/lib/store"

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
  location: z
    .string()
    .min(5, {
      message: "Location must be at least 5 characters.",
    })
    .optional(),
  attachments: z.any().optional(),
})

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const { country, province, district, sector } = useSelector((state: RootState) => state.location)
  const { assignedAdmins } = useSelector((state: RootState) => state.role)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
    },
  })

  const handleCategorySelection = (category: string) => {
    form.setValue("category", category)
  }

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true)
    form.setValue("location", "Current Location: 40.7128° N, 74.0060° W")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!country || !province || !district || !sector) {
      toast({
        title: "Location required",
        description: "Please select your complete location before submitting a complaint.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Find the sector admin for the selected sector
      const sectorAdmin = assignedAdmins.find((admin) => admin.role === "sector" && admin.sector === sector)

      if (!sectorAdmin) {
        toast({
          title: "No admin available",
          description: "There is no sector admin assigned to your location yet.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      dispatch(
        addComplaint({
          id: `complaint-${Date.now()}`,
          title: values.title,
          category: values.category,
          description: values.description,
          location: values.location || "",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responses: [],
          country,
          province,
          district,
          sector,
          assignedTo: sectorAdmin.id,
          escalationLevel: null,
          isEscalated: false,
        }),
      )

      toast({
        title: "Complaint submitted successfully",
        description: `Your complaint has been assigned to the ${sector} sector admin.`,
      })

      router.push("/dashboard/complaints")
    } catch (error) {
      toast({
        title: "Error submitting complaint",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Fill out this form to submit a new complaint. Our AI will help categorize your complaint based on your
            description.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <LocationSelector />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complaint Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title of your complaint" {...field} />
                  </FormControl>
                  <FormDescription>Provide a clear and concise title for your complaint.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of your complaint" className="min-h-32" {...field} />
                  </FormControl>
                  <FormDescription>Provide as much detail as possible about your complaint.</FormDescription>
                  <FormMessage />
                  <AICategorySuggestion description={field.value} onCategorySelected={handleCategorySelection} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="public-services">Public Services</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="safety">Public Safety</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the category that best describes your complaint.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Location</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Specific address or landmark of the issue"
                        {...field}
                        disabled={useCurrentLocation}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      disabled={useCurrentLocation}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use Current
                    </Button>
                  </div>
                  <FormDescription>Specify the exact location of the issue within your sector.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments (Optional)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        className="cursor-pointer"
                        onChange={(e) => {
                          field.onChange(e.target.files)
                        }}
                      />
                    </FormControl>
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                  <FormDescription>
                    Upload photos or documents related to your complaint (max 5MB each).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#157037] hover:bg-[#157037]/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
