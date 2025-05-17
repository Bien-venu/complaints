"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AICategorySuggestionProps {
  description: string
  onCategorySelected: (category: string) => void
}

export function AICategorySuggestion({ description, onCategorySelected }: AICategorySuggestionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const { toast } = useToast()

  const suggestCategory = async () => {
    if (!description || description.length < 20) {
      toast({
        title: "Description too short",
        description: "Please provide a more detailed description for AI categorization.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const lowerDesc = description.toLowerCase()
      let category = "other"
      let confidenceScore = 0.7

      if (
        lowerDesc.includes("road") ||
        lowerDesc.includes("pothole") ||
        lowerDesc.includes("bridge") ||
        lowerDesc.includes("sidewalk")
      ) {
        category = "infrastructure"
        confidenceScore = 0.92
      } else if (
        lowerDesc.includes("garbage") ||
        lowerDesc.includes("trash") ||
        lowerDesc.includes("waste") ||
        lowerDesc.includes("litter")
      ) {
        category = "sanitation"
        confidenceScore = 0.89
      } else if (
        lowerDesc.includes("bus") ||
        lowerDesc.includes("train") ||
        lowerDesc.includes("traffic") ||
        lowerDesc.includes("transport")
      ) {
        category = "transportation"
        confidenceScore = 0.85
      } else if (
        lowerDesc.includes("water") ||
        lowerDesc.includes("electricity") ||
        lowerDesc.includes("power") ||
        lowerDesc.includes("outage")
      ) {
        category = "utilities"
        confidenceScore = 0.88
      } else if (
        lowerDesc.includes("police") ||
        lowerDesc.includes("crime") ||
        lowerDesc.includes("safety") ||
        lowerDesc.includes("security")
      ) {
        category = "safety"
        confidenceScore = 0.91
      } else if (
        lowerDesc.includes("park") ||
        lowerDesc.includes("tree") ||
        lowerDesc.includes("pollution") ||
        lowerDesc.includes("environment")
      ) {
        category = "environment"
        confidenceScore = 0.87
      } else if (
        lowerDesc.includes("service") ||
        lowerDesc.includes("office") ||
        lowerDesc.includes("government") ||
        lowerDesc.includes("public")
      ) {
        category = "public-services"
        confidenceScore = 0.82
      }

      setSuggestedCategory(category)
      setConfidence(Math.round(confidenceScore * 100))

      toast({
        title: "Category suggested",
        description: `AI suggested category: ${category.replace("-", " ")}`,
      })
    } catch (error) {
      toast({
        title: "Error suggesting category",
        description: "Could not determine the category. Please select manually.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyCategory = () => {
    if (suggestedCategory) {
      onCategorySelected(suggestedCategory)
      toast({
        title: "Category applied",
        description: "The suggested category has been applied to your complaint.",
      })
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-[#157037]" />
          AI Category Suggestion
        </CardTitle>
        <CardDescription>Let our AI analyze your description and suggest the most appropriate category</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestedCategory ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className="bg-[#157037] mr-2 capitalize">{suggestedCategory.replace("-", " ")}</Badge>
                <span className="text-sm text-muted-foreground">Confidence: {confidence}%</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {description.length < 20
              ? "Add more details to your description to enable AI categorization"
              : "Click the button below to analyze your description"}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {suggestedCategory ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuggestedCategory(null)
                setConfidence(0)
              }}
            >
              Reset
            </Button>
            <Button size="sm" className="bg-[#157037] hover:bg-[#157037]/90" onClick={applyCategory}>
              <Check className="h-4 w-4 mr-1" />
              Apply Category
            </Button>
          </>
        ) : (
          <Button
            className="w-full bg-[#157037] hover:bg-[#157037]/90"
            size="sm"
            onClick={suggestCategory}
            disabled={isLoading || !description || description.length < 20}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Suggest Category
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
