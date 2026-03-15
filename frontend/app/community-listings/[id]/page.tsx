"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { MapPin, ArrowLeft, ChevronDown, Play, Pause, Loader } from "lucide-react"
import Link from "next/link"
import { fetchFloorPlanById } from "@/lib/api"

interface FloorPlanDetail {
  _id: string
  address: string
  primaryPrice?: string
  description?: string
  floorplanUrl: string
  tacticalAnalysis: {
    overallDefenseGrade: string
    chokePointScore: number
    defensiblePositions: (string | { name: string; reasoning: string })[]
    lootSpawnScore: number
    keyLootZones: (string | { name: string; reasoning: string })[]
    flankVulnerabilityScore: number
    highRiskZones: (string | { name: string; reasoning: string })[]
    sightlineScore: number
    dominantVantagePoints: (string | { name: string; reasoning: string })[]
    combatSummary: string
  }
  submittedBy?: string
  submittedAt: string
}

export default function ListingDetail() {
  const params = useParams()
  const id = params.id as string
  
  const [floorPlan, setFloorPlan] = useState<FloorPlanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReport, setExpandedReport] = useState(false)
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'ready' | 'playing'>('idle')
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchFloorPlan = async () => {
      try {
        setLoading(true)
        const data = await fetchFloorPlanById(id)
        setFloorPlan(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load floor plan")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFloorPlan()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-foreground">Loading floor plan...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !floorPlan) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-lg text-destructive">Error loading floor plan</p>
            <p className="text-sm text-foreground/60">{error}</p>
            <Link
              href="/community-listings"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const generateNarrative = (): string => {
    const ta = floorPlan.tacticalAnalysis
    return `Welcome to the tactical analysis of ${floorPlan.address}. This property has received an overall defense grade of ${ta.overallDefenseGrade}. Let me walk you through the key findings.

Starting with Choke Points, this property scored ${ta.chokePointScore} out of 100. Defensible positions include: ${ta.defensiblePositions.join(", ")}.

Next, Loot Spawns scored ${ta.lootSpawnScore} out of 100. Key loot zones are located at: ${ta.keyLootZones.join(", ")}.

Flank Vulnerability received a score of ${ta.flankVulnerabilityScore} out of 100. High risk zones include: ${ta.highRiskZones.join(", ")}.

Finally, Sightline Analysis scored ${ta.sightlineScore} out of 100. Dominant vantage points are: ${ta.dominantVantagePoints.join(", ")}.

In summary: ${ta.combatSummary}`
  }

  const handlePlayAudio = async () => {
    if (audioStatus === 'playing' && audioElement) {
      audioElement.pause()
      setAudioStatus('ready')
      return
    }

    if (audioStatus === 'ready' && audioElement) {
      audioElement.play()
      setAudioStatus('playing')
      return
    }

    if (audioStatus === 'idle') {
      setAudioStatus('loading')
      try {
        // TODO: Call ElevenLabs API through your backend
        // const response = await fetch('/api/text-to-speech', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ text: generateNarrative() })
        // })
        // const audioData = await response.blob()
        // const url = URL.createObjectURL(audioData)
        // setAudioUrl(url)

        // For now, simulate a delay and show ready state
        await new Promise(resolve => setTimeout(resolve, 2000))
        const audio = new Audio()
        // In production, set audio.src = url
        setAudioElement(audio)
        setAudioStatus('ready')
      } catch (error) {
        console.error('Failed to generate audio:', error)
        setAudioStatus('idle')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        {/* Back Button */}
        <div className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur-md px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/community-listings"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-max"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl font-bold font-tomorrow text-foreground">{floorPlan.address}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                {floorPlan.primaryPrice && (
                  <div className="text-lg font-semibold text-foreground">
                    {floorPlan.primaryPrice}
                  </div>
                )}
                <div>
                  <span className="text-sm">Grade: {floorPlan.tacticalAnalysis.overallDefenseGrade}</span>
                </div>
                <span className="text-sm">Submitted by {floorPlan.submittedBy || 'Anonymous'} on {new Date(floorPlan.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Main Layout - Floor Plan (Sticky) + Analysis (Scrollable) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Floor Plan - Sticky on Desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                    {floorPlan.floorplanUrl ? (
                      <img
                        src={floorPlan.floorplanUrl}
                        alt="Floor Plan"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23999' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='white'%3EFloor Plan%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Floor plan image unavailable
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Report - Scrollable */}
              <div className="lg:col-span-2 space-y-8">
                {/* Metrics Summary */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Tactical Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Choke Points</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.chokePointScore}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Loot Spawns</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.lootSpawnScore}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Flank Vulnerability</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.flankVulnerabilityScore}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sightline Analysis</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.sightlineScore}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">Overall Defense Grade</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {floorPlan.tacticalAnalysis.overallDefenseGrade}
                    </p>
                  </div>
                </div>

                {/* Audio Narration Card */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Tactical Briefing Audio</h2>
                  <p className="text-sm text-muted-foreground">
                    Listen to an ElevenLabs-generated narrative analysis of this property. Audio is generated on-demand when you press play.
                  </p>

                  {/* Audio Player */}
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    {/* Play/Pause Button */}
                    <button
                      onClick={handlePlayAudio}
                      disabled={audioStatus === 'loading'}
                      className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {audioStatus === 'loading' ? (
                        <Loader className="w-6 h-6 animate-spin" />
                      ) : audioStatus === 'playing' ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    {/* Status Text */}
                    <div className="flex-1">
                      {audioStatus === 'idle' && (
                        <p className="text-sm text-muted-foreground">
                          Click play to generate and listen to the audio briefing
                        </p>
                      )}
                      {audioStatus === 'loading' && (
                        <p className="text-sm text-foreground">
                          Generating audio briefing with ElevenLabs...
                        </p>
                      )}
                      {audioStatus === 'ready' && (
                        <p className="text-sm text-foreground">
                          Audio ready. Click play to listen.
                        </p>
                      )}
                      {audioStatus === 'playing' && (
                        <p className="text-sm text-foreground">
                          Now playing tactical briefing...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {floorPlan.description && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold text-foreground mb-3">Description</h2>
                    <p className="text-foreground">{floorPlan.description}</p>
                  </div>
                )}

                {/* Tactical Analysis Details - Collapsible on Mobile */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  {/* Mobile Header - Collapsible */}
                  <button
                    onClick={() => setExpandedReport(!expandedReport)}
                    className="lg:hidden w-full flex items-center justify-between gap-2 text-left"
                  >
                    <h2 className="text-2xl font-bold text-foreground">Tactical Details</h2>
                    <ChevronDown
                      className={`w-6 h-6 text-foreground transition-transform ${
                        expandedReport ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Header - Always visible */}
                  <h2 className="hidden lg:block text-2xl font-bold text-foreground">Tactical Details</h2>

                  {/* Report Content - Collapsible on Mobile, Always Visible on Desktop */}
                  <div
                    className={`overflow-y-auto lg:overflow-visible transition-all lg:max-h-none ${
                      expandedReport ? 'max-h-[70vh]' : 'max-h-0 lg:max-h-none'
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Defensible Positions */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Defensible Positions</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {floorPlan.tacticalAnalysis.defensiblePositions.map((pos, idx) => {
                            const name = typeof pos === 'string' ? pos : pos.name
                            return <li key={idx} className="text-foreground">{name}</li>
                          })}
                        </ul>
                      </div>

                      {/* Key Loot Zones */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Key Loot Zones</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {floorPlan.tacticalAnalysis.keyLootZones.map((zone, idx) => {
                            const name = typeof zone === 'string' ? zone : zone.name
                            return <li key={idx} className="text-foreground">{name}</li>
                          })}
                        </ul>
                      </div>

                      {/* High Risk Zones */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">High Risk Zones</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {floorPlan.tacticalAnalysis.highRiskZones.map((zone, idx) => {
                            const name = typeof zone === 'string' ? zone : zone.name
                            return <li key={idx} className="text-foreground">{name}</li>
                          })}
                        </ul>
                      </div>

                      {/* Dominant Vantage Points */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Dominant Vantage Points</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {floorPlan.tacticalAnalysis.dominantVantagePoints.map((point, idx) => {
                            const name = typeof point === 'string' ? point : point.name
                            return <li key={idx} className="text-foreground">{name}</li>
                          })}
                        </ul>
                      </div>

                      {/* Combat Summary */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Combat Summary</h3>
                        <p className="text-foreground">{floorPlan.tacticalAnalysis.combatSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
