"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface GetStartedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GetStartedDialog({ open, onOpenChange }: GetStartedDialogProps) {
  const [step, setStep] = useState(1)

  const totalSteps = 3

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onOpenChange(false)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const tips = [
    {
      title: "Paste a Rightmove Link",
      description: "Find a property on Rightmove and paste the URL into the input field at the top of the homepage. We'll automatically extract the floor plan and property details for tactical analysis."
    },
    {
      title: "Upload a Floor Plan",
      description: "Don't have a Rightmove link? You can upload a floor plan PDF or image directly using the upload button on the homepage. Supports images and PDF documents."
    },
    {
      title: "View Community Listings",
      description: "Browse tactical analyses submitted by other users. Sort by different metrics, view detailed floor plan breakdowns, and listen to professional audio narrations of each property analysis."
    }
  ]

  const currentTip = tips[step - 1]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col gap-6 py-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              Tips & Guides — {step} of {totalSteps}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i + 1 <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tip Content */}
          <div className="flex flex-col gap-4">
            {/* Screenshot/Image Placeholder */}
            <div className="flex items-center justify-center h-48 bg-muted rounded-lg border-2 border-dashed border-border">
              <span className="text-sm text-muted-foreground">Screenshot placeholder — Add your screenshot here</span>
            </div>

            {/* Tip Text */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{currentTip?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentTip?.description}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {step === totalSteps ? "Close" : "Next"}
              {step !== totalSteps && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
