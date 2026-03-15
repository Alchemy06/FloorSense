"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Send, Sparkles, Plus } from "lucide-react"

export function Hero() {
  const [propertyUrl, setPropertyUrl] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleAnalyze = () => {
    if (propertyUrl.trim()) {
      console.log("Analyzing:", propertyUrl)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPendingFile(file)
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmUpload = () => {
    if (pendingFile) {
      setUploadedFile(pendingFile)
      console.log("File confirmed and stored:")
      console.log("- Name:", pendingFile.name)
      console.log("- Size:", pendingFile.size, "bytes")
      console.log("- Type:", pendingFile.type)
      console.log("- Full File Object:", pendingFile)
      // TODO: Send to backend API here
      // Example: await uploadFileToBackend(pendingFile)
    }
    setShowConfirmDialog(false)
    setPendingFile(null)
  }

  const handleDeclineUpload = () => {
    console.log("File upload cancelled")
    setShowConfirmDialog(false)
    setPendingFile(null)
  }

  const triggerFileInput = () => {
    document.getElementById("floor-plan-input")?.click()
  }

  return (
    <section className="relative w-full pt-20 pb-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        {/* Headline */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-tomorrow tracking-tight text-foreground leading-tight">
            Real estate through a tactical lens
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Analyze floor plans like competitive gaming maps. Choke points, loot spawns, flank vulnerability, gamified property valuation.
          </p>
        </div>

        {/* Enhanced Search Box */}
        <div className="space-y-4">
          <div className={`relative w-full max-w-2xl mx-auto transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
            {/* Shine effect */}
            <div className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none ${isFocused ? '' : 'hidden'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-shine" style={{
                backgroundSize: '200% 100%',
              }} />
            </div>
            
            {/* Search container */}
            <div className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
              isFocused 
                ? 'border-primary bg-primary/5 shadow-lg' 
                : 'border-border bg-card hover:border-primary/50'
            }`}>
              {/* Icon with animation */}
              <div className={`flex-shrink-0 transition-all duration-300 ${isFocused ? 'animate-pulse' : ''}`}>
                <Sparkles className={`w-6 h-6 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              
              {/* Input */}
              <input
                type="url"
                placeholder="Send the Rightmove property URL or upload a floor plan!"
                value={propertyUrl}
                onChange={(e) => setPropertyUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg font-medium"
              />
              
              {/* Upload button with tooltip */}
              <div className="relative group">
                <button
                  onClick={triggerFileInput}
                  className="p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {uploadedFile ? uploadedFile.name : "Upload floor plan"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </div>
              </div>

              {/* Hidden file input */}
              <input
                id="floor-plan-input"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Action button */}
              <button
                onClick={handleAnalyze}
                disabled={!propertyUrl.trim()}
                className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                  propertyUrl.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Helper text with animation */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground animate-fade-in">
              Example: https://www.rightmove.co.uk/properties/165641261
            </p>
            <p className="text-xs text-muted-foreground/60">
              🎮 Analysis powered by Gemini Vision + ElevenLabs
            </p>
          </div>
        </div>
      </div>

      {/* Upload Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm File Upload</DialogTitle>
            <DialogDescription>
              {pendingFile && (
                <div className="space-y-2">
                  <p>You are about to upload:</p>
                  <div className="bg-muted p-3 rounded-lg break-all">
                    <p className="font-semibold text-foreground">{pendingFile.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Size: {(pendingFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <p>Do you want to proceed?</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <button
              onClick={handleDeclineUpload}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmUpload}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </section>
  )
}
