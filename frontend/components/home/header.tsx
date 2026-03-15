"use client"

import { useState } from "react"
import GameButton from "@/components/ui/game-button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className=" top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="FloorSense" className="h-60 w-auto" />
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
            <GameButton size="sm">
              Get started
            </GameButton>
          </div>
        </div>
      </div>

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