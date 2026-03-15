"use client"

import { useState } from "react"
import GameButton from "@/components/ui/game-button"
import { GetStartedDialog } from "@/components/home/get-started-dialog"
import { Menu, X, Zap } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [getStartedOpen, setGetStartedOpen] = useState(false)

  return (
    <header className=" top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
          {/* Logo Icon */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-lg transform group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute inset-1 bg-background rounded-md flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary font-bold" />
            </div>
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col gap-0">
            <span className="font-tomorrow font-bold text-base text-foreground leading-none group-hover:text-primary transition-colors">FloorSense</span>
            <span className="text-xs text-primary font-semibold leading-none">TACTICAL</span>
          </div>
        </a>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <a 
            href="#features" 
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          >
            Features
          </a>
          <a 
            href="/#examples" 
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          >
            Demo
          </a>
          <a 
            href="/community-listings" 
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          >
            Community Listings
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          {/* Desktop Button */}
          <div className="hidden sm:block">
            <GameButton size="sm" onClick={() => setGetStartedOpen(true)}>
              Tips & Guides
            </GameButton>
          </div>
        </div>
      </div>

      {/* Get Started Dialog */}
      <GetStartedDialog open={getStartedOpen} onOpenChange={setGetStartedOpen} />

      {/* Mobile dropdown menu - appears on top without affecting page width */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-background border-b border-border/40 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            <a 
              href="#features" 
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="/#examples" 
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </a>
            <a 
              href="/community-listings" 
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community Listings
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}