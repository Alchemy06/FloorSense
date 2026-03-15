"use client"

import { useState } from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { ArrowUpDown, MapPin, Home, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 6

interface Listing {
  id: string
  title: string
  location: string
  type: string
  chokePoints: number
  lootSpawns: number
  flankVulnerability: number
  sightlineAnalysis: number
  overallScore: number
  submittedBy: string
  submittedAt: string
}

// Mock data - replace with API call later
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern City Center Apartment",
    location: "London, UK",
    type: "Apartment",
    chokePoints: 8.5,
    lootSpawns: 7.2,
    flankVulnerability: 6.8,
    sightlineAnalysis: 7.5,
    overallScore: 7.5,
    submittedBy: "John D.",
    submittedAt: "2024-03-10"
  },
  {
    id: "2",
    title: "Victorian Townhouse",
    location: "Bristol, UK",
    type: "House",
    chokePoints: 9.0,
    lootSpawns: 8.1,
    flankVulnerability: 7.2,
    sightlineAnalysis: 8.3,
    overallScore: 8.2,
    submittedBy: "Sarah M.",
    submittedAt: "2024-03-08"
  },
  {
    id: "3",
    title: "Contemporary Studio",
    location: "Manchester, UK",
    type: "Studio",
    chokePoints: 6.5,
    lootSpawns: 6.8,
    flankVulnerability: 5.9,
    sightlineAnalysis: 6.2,
    overallScore: 6.4,
    submittedBy: "Alex T.",
    submittedAt: "2024-03-05"
  },
  {
    id: "4",
    title: "Luxury Penthouse",
    location: "Edinburgh, UK",
    type: "Penthouse",
    chokePoints: 7.8,
    lootSpawns: 8.9,
    flankVulnerability: 8.1,
    sightlineAnalysis: 9.2,
    overallScore: 8.5,
    submittedBy: "Emma K.",
    submittedAt: "2024-03-01"
  }
]

type SortBy = "overall" | "chokePoints" | "lootSpawns" | "flankVulnerability" | "sightlineAnalysis" | "recent"

export default function CommunityListings() {
  const [sortBy, setSortBy] = useState<SortBy>("overall")
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (sortType: SortBy) => {
    setSortBy(sortType)
    setCurrentPage(1) // Reset to first page when sorting changes
    let sorted = [...mockListings]

    switch (sortType) {
      case "overall":
        sorted.sort((a, b) => b.overallScore - a.overallScore)
        break
      case "chokePoints":
        sorted.sort((a, b) => b.chokePoints - a.chokePoints)
        break
      case "lootSpawns":
        sorted.sort((a, b) => b.lootSpawns - a.lootSpawns)
        break
      case "flankVulnerability":
        sorted.sort((a, b) => b.flankVulnerability - a.flankVulnerability)
        break
      case "sightlineAnalysis":
        sorted.sort((a, b) => b.sightlineAnalysis - a.sightlineAnalysis)
        break
      case "recent":
        sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        break
    }

    setListings(sorted)
  }

  // Pagination calculations
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedListings = listings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold font-tomorrow text-foreground">
              Community Listings
            </h1>
            <p className="text-lg text-foreground">
              Discover tactical analysis from properties analyzed by our community. Sort by different metrics to find the most interesting insights.
            </p>
          </div>

          {/* Sorting Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Sort by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort("overall")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "overall"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Overall Score
              </button>
              <button
                onClick={() => handleSort("chokePoints")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "chokePoints"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Choke Points
              </button>
              <button
                onClick={() => handleSort("lootSpawns")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "lootSpawns"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Loot Spawns
              </button>
              <button
                onClick={() => handleSort("flankVulnerability")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "flankVulnerability"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Flank Vulnerability
              </button>
              <button
                onClick={() => handleSort("sightlineAnalysis")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "sightlineAnalysis"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Sightline Analysis
              </button>
              <button
                onClick={() => handleSort("recent")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  sortBy === "recent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Most Recent
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors space-y-4 group"
              >
                {/* Title and Location */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{listing.title}</h3>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                </div>

                {/* Property Type */}
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{listing.type}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">Choke Points</p>
                    <p className="text-lg font-semibold text-foreground">{listing.chokePoints}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">Loot Spawns</p>
                    <p className="text-lg font-semibold text-foreground">{listing.lootSpawns}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">Flank Vulnerability</p>
                    <p className="text-lg font-semibold text-foreground">{listing.flankVulnerability}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">Sightline Analysis</p>
                    <p className="text-lg font-semibold text-foreground">{listing.sightlineAnalysis}</p>
                  </div>
                </div>

                {/* Overall Score and Button */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">Overall Score</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {listing.overallScore}
                    </p>
                  </div>
                  <a
                    href={`/community-listings/${listing.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Submitted Info */}
                <div className="text-xs text-foreground border-t border-border/50 pt-3">
                  <p>Submitted by {listing.submittedBy} on {listing.submittedAt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Empty State */}
          {listings.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <p className="text-lg text-foreground">No listings found</p>
              <p className="text-sm text-foreground/60">Be the first to submit a floor plan analysis!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
