"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { ArrowUpDown, MapPin, Home, ChevronRight, Loader } from "lucide-react"
import { fetchFloorPlans } from "@/lib/api"

const ITEMS_PER_PAGE = 6

interface TacticalAnalysis {
  chokePointScore: number
  lootSpawnScore: number
  flankVulnerabilityScore: number
  sightlineScore: number
  overallDefenseGrade: string
}

interface Listing {
  _id: string
  address: string
  primaryPrice?: string
  description?: string
  floorplanUrl: string
  tacticalAnalysis: TacticalAnalysis
  submittedBy?: string
  submittedAt: string
  status: string
}

type SortBy = "overall" | "chokePoints" | "lootSpawns" | "flankVulnerability" | "sightlineAnalysis" | "recent"

function transformFloorPlanToListing(floorPlan: any): Listing {
  return {
    _id: floorPlan._id,
    address: floorPlan.address,
    primaryPrice: floorPlan.primaryPrice,
    description: floorPlan.description,
    floorplanUrl: floorPlan.floorplanUrl,
    tacticalAnalysis: floorPlan.tacticalAnalysis,
    submittedBy: floorPlan.submittedBy || "Anonymous",
    submittedAt: floorPlan.submittedAt,
    status: floorPlan.status,
  }
}

export default function CommunityListings() {
  const [sortBy, setSortBy] = useState<SortBy>("recent")
  const [listings, setListings] = useState<Listing[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch data when component mounts or when sortBy/currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchFloorPlans(sortBy, currentPage, ITEMS_PER_PAGE)
        const transformedListings = data.floorPlans.map(transformFloorPlanToListing)
        setListings(transformedListings)
        setTotalPages(data.pagination.pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch listings")
        console.error("Error fetching listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sortBy, currentPage])

  const handleSort = (sortType: SortBy) => {
    setSortBy(sortType)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <p className="text-foreground">Loading listings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <p className="text-lg text-destructive">Error loading listings</p>
              <p className="text-sm text-foreground/60">{error}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-lg text-foreground">No listings found</p>
              <p className="text-sm text-foreground/60">Be the first to submit a floor plan analysis!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors space-y-4 group"
                >
                  {/* Title and Location */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{listing.address}</h3>
                    {listing.primaryPrice && (
                      <p className="text-sm text-foreground/60">{listing.primaryPrice}</p>
                    )}
                  </div>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-muted rounded text-foreground">
                      {listing.status === "analyzed" ? "Analyzed" : "Pending"}
                    </span>
                    {listing.tacticalAnalysis?.overallDefenseGrade && (
                      <span className="text-sm font-semibold text-primary">
                        Grade: {listing.tacticalAnalysis.overallDefenseGrade}
                      </span>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/50">
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">Choke Points</p>
                      <p className="text-lg font-semibold text-foreground">
                        {listing.tacticalAnalysis?.chokePointScore || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">Loot Spawns</p>
                      <p className="text-lg font-semibold text-foreground">
                        {listing.tacticalAnalysis?.lootSpawnScore || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">Flank Vuln.</p>
                      <p className="text-lg font-semibold text-foreground">
                        {listing.tacticalAnalysis?.flankVulnerabilityScore || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">Sightline</p>
                      <p className="text-lg font-semibold text-foreground">
                        {listing.tacticalAnalysis?.sightlineScore || 0}
                      </p>
                    </div>
                  </div>

                  {/* Description and Button */}
                  <div className="flex items-end justify-between gap-4">
                    {listing.description && (
                      <p className="text-sm text-foreground/60 line-clamp-2 flex-1">
                        {listing.description}
                      </p>
                    )}
                    <a
                      href={`/community-listings/${listing._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Submitted Info */}
                  <div className="text-xs text-foreground border-t border-border/50 pt-3">
                    <p>Submitted by {listing.submittedBy} on {new Date(listing.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`w-9 h-9 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
