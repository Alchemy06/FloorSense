"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { ArrowLeft, ChevronDown, Play, Pause, Loader, Check, X, Share2 } from "lucide-react"
import Link from "next/link"
import { fetchFloorPlanById } from "@/lib/api"

interface FloorPlanAnalysis {
  _id: string
  address: string
  primaryPrice?: string
  secondaryPrice?: string
  description?: string
  keyFeatures?: string[]
  floorplanUrl: string
  status: 'pending' | 'analyzed' | 'archived'
  tacticalAnalysis?: {
    overallDefenseGrade: string
    overallDefenseReasoning?: string
    chokePointScore: number
    chokePointExplanation?: string
    defensiblePositions: (string | { name: string; reasoning: string })[]
    lootSpawnScore: number
    lootSpawnExplanation?: string
    keyLootZones: (string | { name: string; reasoning: string })[]
    flankVulnerabilityScore: number
    flankExplanation?: string
    highRiskZones: (string | { name: string; reasoning: string })[]
    sightlineScore: number
    sightlineExplanation?: string
    dominantVantagePoints: (string | { name: string; reasoning: string })[]
    combatSummary: string
    gameifiedNarrative?: string
  }
  submittedBy?: string
  submittedAt: string
}

export default function AnalysisReviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [floorPlan, setFloorPlan] = useState<FloorPlanAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReport, setExpandedReport] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'ready' | 'playing'>('idle')
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [narrativeText, setNarrativeText] = useState<string>('')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (!id) return

    let pollInterval: NodeJS.Timeout | null = null
    let attemptCount = 0
    const maxAttempts = 60 // 120 seconds max (2-second intervals)

    const fetchFloorPlan = async () => {
      try {
        const data = await fetchFloorPlanById(id)
        
        // Check if analysis is complete
        if (data?.tacticalAnalysis) {
          setFloorPlan(data)
          setLoading(false)
          if (pollInterval) clearInterval(pollInterval)
          setError(null)
        } else {
          // Analysis not ready yet, will retry
          attemptCount++
          
          if (attemptCount === 1) {
            // First fetch, show loading state
            setLoading(true)
          }
          
          if (attemptCount >= maxAttempts) {
            // Timeout after 2 minutes
            setError("Analysis is taking longer than expected. Please try again in a moment.")
            setLoading(false)
            if (pollInterval) clearInterval(pollInterval)
          }
        }
      } catch (err) {
        attemptCount++
        if (attemptCount >= maxAttempts) {
          setError(err instanceof Error ? err.message : "Failed to load analysis")
          setLoading(false)
          if (pollInterval) clearInterval(pollInterval)
        }
      }
    }

    // Initial fetch
    fetchFloorPlan()

    // Poll every 2 seconds if analysis not ready
    pollInterval = setInterval(() => {
      attemptCount++
      if (attemptCount < maxAttempts) {
        fetchFloorPlan()
      }
    }, 2000)

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [id])

  const generateNarrative = (): string => {
    if (!floorPlan?.tacticalAnalysis) return ""
    // Use Claude's gameified narrative if available, so users listen to professional content
    return floorPlan.tacticalAnalysis.gameifiedNarrative || ""
  }

  const handlePlayAudio = async () => {
    // If already playing, pause
    if (audioStatus === 'playing' && audioElement) {
      audioElement.pause()
      setAudioStatus('ready')
      return
    }

    // If ready (audio generated but stopped), resume
    if (audioStatus === 'ready' && audioElement) {
      audioElement.play()
      setAudioStatus('playing')
      return
    }

    // If idle, generate audio from ElevenLabs, then play
    if (audioStatus === 'idle') {
      setAudioStatus('loading')
      try {
        const narrative = generateNarrative()
        setNarrativeText(narrative)

        // Call backend API to generate audio with ElevenLabs (lazy-load only on play)
        console.log('🎤 Requesting ElevenLabs audio generation...')
        const response = await fetch('/api/submit/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ narrative: narrative }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData.details || errorData.error || response.statusText
          console.error('Audio generation error response:', errorData)
          throw new Error(`Audio generation failed: ${errorMsg}`)
        }

        const data = await response.json()
        const audioDataUrl = data.audio

        if (!audioDataUrl) {
          console.error('❌ No audio data in response:', data)
          throw new Error('No audio data received from server')
        }

        console.log('🎵 Audio data received, length:', audioDataUrl.length)
        console.log('🎵 Audio data preview:', audioDataUrl.substring(0, 50) + '...')

        // Create audio element with the generated audio
        const audio = new Audio(audioDataUrl)

        // Set up event listeners for tracking playback
        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime)
        })

        audio.addEventListener('loadedmetadata', () => {
          console.log('🎵 Audio metadata loaded, duration:', audio.duration)
          setDuration(audio.duration)
        })

        audio.addEventListener('ended', () => {
          console.log('🎵 Audio playback finished')
          setAudioStatus('ready')
          setCurrentTime(0)
        })

        audio.addEventListener('error', (e) => {
          console.error('❌ Audio playback error event:', {
            error: e,
            errorCode: audio.error?.code,
            errorMessage: audio.error?.message,
            src: audio.src.substring(0, 100),
          })
          setAudioStatus('idle')
          alert(`Audio playback failed: ${audio.error?.message || 'Unknown error'}`)
        })

        console.log('🎵 Audio element created, attempting to play...')
        setAudioElement(audio)
        await audio.play()
        console.log('🎵 Audio playback started')
        setAudioStatus('playing')
      } catch (error) {
        console.error('❌ Failed to generate audio:', {
          message: error instanceof Error ? error.message : String(error),
          error: error,
        })
        setAudioStatus('idle')
        alert(error instanceof Error ? error.message : 'Failed to generate audio. Please try again.')
      }
    }
  }

  const handleStopAudio = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setCurrentTime(0)
      setAudioStatus('idle')
    }
  }

  const handleRewind = () => {
    if (audioElement) {
      audioElement.currentTime = Math.max(0, audioElement.currentTime - 10)
    }
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePublish = async () => {
    if (!floorPlan) return
    
    setPublishing(true)
    try {
      // TODO: API call to publish to community listings
      // For now, just redirect
      setTimeout(() => {
        router.push(`/community-listings/${id}`)
      }, 1000)
    } catch (err) {
      console.error('Failed to publish:', err)
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Analyzing your floor plan</h2>
              <p className="text-foreground/60">
                Claude AI is examining the property layout and generating tactical analysis...
              </p>
              <p className="text-sm text-foreground/40 mt-4">
                This typically takes 30-60 seconds. Please don't refresh the page.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !floorPlan || !floorPlan.tacticalAnalysis) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md space-y-6">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-foreground">Analysis Unavailable</h2>
                  <p className="text-sm text-foreground/70">
                    {error || "The floor plan analysis is not yet available. Claude AI may still be processing your request."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>
            
            <p className="text-xs text-foreground/40 text-center">
              If the problem persists, try submitting your property again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        {/* Back Button */}
        <div className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur-md px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-max"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold font-tomorrow text-foreground">{floorPlan.address}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground mt-4">
                    {floorPlan.primaryPrice && (
                      <div className="text-lg font-semibold text-foreground">
                        {floorPlan.primaryPrice}
                      </div>
                    )}
                    <span className="text-sm">Status: Analysis Complete ✓</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {publishing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {publishing ? 'Publishing...' : 'Publish to Community'}
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    If you skip this, you won't be able to recover it. You'll need to resubmit the link.
                  </p>
                </div>
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
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23999' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='white'%3EFloor Plan%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Floor plan image unavailable
                      </div>
                    )}
                  </div>

                  {/* Property Features */}
                  {floorPlan.keyFeatures && floorPlan.keyFeatures.length > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Features</h3>
                      <div className="space-y-2">
                        {floorPlan.keyFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-foreground/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Report - Scrollable */}
              <div className="lg:col-span-2 space-y-8">
                {/* Metrics Summary */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Tactical Metrics Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase">Choke Points</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.chokePointScore}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase">Loot Spawns</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.lootSpawnScore}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase">Flank Risk</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.flankVulnerabilityScore}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase">Sightlines</p>
                      <p className="text-3xl font-bold text-primary">{floorPlan.tacticalAnalysis.sightlineScore}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Overall Defense Grade</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {floorPlan.tacticalAnalysis.overallDefenseGrade}
                    </p>
                  </div>
                </div>

                {/* Audio Narration Card */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Tactical Briefing Audio</h2>
                  <p className="text-sm text-muted-foreground">
                    Listen to an engaging AI narrative of this property's tactical potential. Perfect for when you're in a rush.
                  </p>

                  {/* Audio Player - Sleek UI */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-5 border border-primary/20 space-y-4">
                    {/* Control Buttons */}
                    <div className="flex items-center gap-3">
                      {/* Rewind Button */}
                      <button
                        onClick={handleRewind}
                        disabled={audioStatus !== 'playing'}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-foreground"
                        title="Rewind 10 seconds"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.99 5V1l-5 5 5 5v-4c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                        </svg>
                      </button>

                      {/* Play/Pause Button */}
                      <button
                        onClick={handlePlayAudio}
                        disabled={audioStatus === 'loading'}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg"
                      >
                        {audioStatus === 'loading' ? (
                          <Loader className="w-6 h-6 animate-spin" />
                        ) : audioStatus === 'playing' ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>

                      {/* Stop Button */}
                      <button
                        onClick={handleStopAudio}
                        disabled={audioStatus === 'idle' || audioStatus === 'loading'}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-foreground"
                        title="Stop"
                      >
                        <div className="w-3 h-3 bg-foreground rounded-sm" />
                      </button>

                      {/* Time Display */}
                      <div className="ml-auto text-sm font-medium text-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-muted-foreground">{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-xs text-muted-foreground text-center">
                      {audioStatus === 'idle' && 'Click play to generate and listen to the tactical briefing'}
                      {audioStatus === 'loading' && 'Generating audio with ElevenLabs... this may take a moment'}
                      {audioStatus === 'ready' && 'Ready to listen. Click play to start.'}
                      {audioStatus === 'playing' && 'Now playing your tactical briefing...'}
                    </div>
                  </div>

                  {/* Narrative Preview */}
                  {narrativeText && (
                    <div className="mt-4 p-4 bg-muted rounded-lg border border-border/50 space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Script Preview</p>
                      <p className="text-sm text-foreground/80 line-clamp-3">{narrativeText}</p>
                      <p className="text-xs text-muted-foreground/60">The audio plays faster than reading. Enjoy!</p>
                    </div>
                  )}
                </div>

                {/* Description - Now Collapsible */}
                {floorPlan.description && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="w-full flex items-center justify-between gap-2 text-left p-6 hover:bg-muted/30 transition-colors"
                    >
                      <h2 className="text-xl font-bold text-foreground">Property Description</h2>
                      <ChevronDown
                        className={`w-5 h-5 text-foreground transition-transform ${
                          expandedDescription ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedDescription && (
                      <div className="px-6 pb-6 pt-0 border-t border-border/50">
                        <p className="text-foreground text-sm leading-relaxed">{floorPlan.description}</p>
                      </div>
                    )}
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
                      {/* Overall Defense Reasoning */}
                      {floorPlan.tacticalAnalysis.overallDefenseReasoning && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 pb-5">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Defense Grade Rationale</h3>
                          <p className="text-sm text-foreground leading-relaxed">{floorPlan.tacticalAnalysis.overallDefenseReasoning}</p>
                        </div>
                      )}

                      {/* Defensible Positions */}
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Defensible Positions
                            <span className="text-sm font-normal text-muted-foreground ml-auto">
                              Score: {floorPlan.tacticalAnalysis.chokePointScore}/100
                            </span>
                          </h3>
                          {floorPlan.tacticalAnalysis.chokePointExplanation && (
                            <p className="text-sm text-foreground/70 mb-3">{floorPlan.tacticalAnalysis.chokePointExplanation}</p>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {floorPlan.tacticalAnalysis.defensiblePositions.map((pos, idx) => {
                            const name = typeof pos === 'string' ? pos : pos.name
                            const reasoning = typeof pos === 'string' ? undefined : pos.reasoning
                            return (
                              <li key={idx} className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1 text-lg">✓</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{name}</p>
                                    {reasoning && <p className="text-xs text-foreground/70 mt-1">{reasoning}</p>}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Key Loot Zones */}
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" />
                            Key Asset Zones
                            <span className="text-sm font-normal text-muted-foreground ml-auto">
                              Score: {floorPlan.tacticalAnalysis.lootSpawnScore}/100
                            </span>
                          </h3>
                          {floorPlan.tacticalAnalysis.lootSpawnExplanation && (
                            <p className="text-sm text-foreground/70 mb-3">{floorPlan.tacticalAnalysis.lootSpawnExplanation}</p>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {floorPlan.tacticalAnalysis.keyLootZones.map((zone, idx) => {
                            const name = typeof zone === 'string' ? zone : zone.name
                            const reasoning = typeof zone === 'string' ? undefined : zone.reasoning
                            return (
                              <li key={idx} className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1 text-lg">→</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{name}</p>
                                    {reasoning && <p className="text-xs text-foreground/70 mt-1">{reasoning}</p>}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* High Risk Zones */}
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                            <X className="w-5 h-5 text-red-500" />
                            High Risk Zones
                            <span className="text-sm font-normal text-muted-foreground ml-auto">
                              Risk: {floorPlan.tacticalAnalysis.flankVulnerabilityScore}/100
                            </span>
                          </h3>
                          {floorPlan.tacticalAnalysis.flankExplanation && (
                            <p className="text-sm text-foreground/70 mb-3">{floorPlan.tacticalAnalysis.flankExplanation}</p>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {floorPlan.tacticalAnalysis.highRiskZones.map((zone, idx) => {
                            const name = typeof zone === 'string' ? zone : zone.name
                            const reasoning = typeof zone === 'string' ? undefined : zone.reasoning
                            return (
                              <li key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-red-500 mt-1 text-lg">⚠</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{name}</p>
                                    {reasoning && <p className="text-xs text-foreground/70 mt-1">{reasoning}</p>}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Dominant Vantage Points */}
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                            📍
                            Dominant Vantage Points
                            <span className="text-sm font-normal text-muted-foreground ml-auto">
                              Score: {floorPlan.tacticalAnalysis.sightlineScore}/100
                            </span>
                          </h3>
                          {floorPlan.tacticalAnalysis.sightlineExplanation && (
                            <p className="text-sm text-foreground/70 mb-3">{floorPlan.tacticalAnalysis.sightlineExplanation}</p>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {floorPlan.tacticalAnalysis.dominantVantagePoints.map((point, idx) => {
                            const name = typeof point === 'string' ? point : point.name
                            const reasoning = typeof point === 'string' ? undefined : point.reasoning
                            return (
                              <li key={idx} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-amber-500 mt-1 text-lg">◆</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{name}</p>
                                    {reasoning && <p className="text-xs text-foreground/70 mt-1">{reasoning}</p>}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Combat Summary */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Summary</h3>
                        <p className="text-sm text-foreground leading-relaxed">{floorPlan.tacticalAnalysis.combatSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publish CTA */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Ready to Share?</h2>
                  <p className="text-sm text-muted-foreground">
                    This analysis looks great! Publish it to the community listings so others can see the tactical breakdown of this property.
                  </p>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {publishing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {publishing ? 'Publishing...' : 'Publish to Community Listings'}
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    If you skip this, you won't be able to recover it. You'll need to resubmit the link.
                  </p>
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
