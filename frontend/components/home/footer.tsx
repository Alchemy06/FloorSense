"use client"

import GameButton from "@/components/ui/game-button"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">FS</span>
              </div>
              <span className="font-semibold text-sm">FloorSense</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tactical property valuation for competitive minds.
            </p>
          </div>

          {/* Product & Company Side by Side on Mobile */}
          <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-2">
            {/* Product */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://devpost.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Devpost
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Listings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h4 className="font-semibold text-sm">Get started</h4>
            <p className="text-sm text-muted-foreground">Analyze your first property today.</p>
            <GameButton className="w-full" size="sm">Sign up</GameButton>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 FloorSense. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
