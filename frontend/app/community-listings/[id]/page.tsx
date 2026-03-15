"use client"

import { useState } from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { MapPin, Home, ArrowLeft, Download, ChevronDown, Play, Pause, Loader } from "lucide-react"
import Link from "next/link"

// Mock data - replace with API call later
const mockListingDetails = {
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
  submittedAt: "2024-03-10",
  floorPlanImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=800&fit=crop",
  description: "A stunning modern apartment in the heart of London with an open floor plan and excellent tactical positioning.",
  analysisReport: `
Executive Summary
This modern apartment has been thoroughly analyzed for tactical advantages and vulnerabilities. The overall score of 7.5/10 reflects a well-balanced property with some notable strengths and areas for consideration.

Choke Points (8.5/10)
**Hallway Control**: Narrow corridor leading to main rooms provides good defensive positioning
- Limited approach vectors from entrance
- Strong cover available from kitchen counter
- Single escape route requires planning

**Cover Density**: Excellent - Multiple barriers and obstacles
- Kitchen island for defensive positioning
- Bedroom furniture arrangements
- Living area couch placement

**Multiple Exits**: Good - Multiple escape routes available
- Primary exit through main hallway
- Secondary exit through kitchen to balcony
- Bedroom window emergency exit

**Entry Points**: 3 primary entry vectors
- Main entrance (primary)
- Kitchen balcony door
- Living room balcony access

Loot Spawns (7.2/10)
**Resource Clustering**: Moderately dense distribution
- Kitchen contains primary resources
- Bedroom has secondary loot locations
- Bathroom supplies concentrated in one area

**Accessibility**: Good reach without compromise
- Most items within 5 meters of movement
- Counter height optimal for gathering
- Storage areas well-positioned

**Storage Capacity**: Strong total volume
- Multiple built-in wardrobes
- Kitchen cabinets and drawers
- Living area shelving

**Defense Rating**: Moderate protection
- Some cover while gathering in kitchen
- Exposed during bathroom supply acquisition
- Living area exposed to multiple angles

Flank Vulnerability (6.8/10)
**Sightline Exposure**: Moderate exposure
- Living room windows visible from opposite buildings
- Balcony doors provide exterior visibility
- Interior sightlines somewhat contained

**Blind Entry Routes**: Limited options
- Main entrance is primary approach
- Kitchen balcony provides secondary access
- Limited concealed approaches

**Open Concept Layout**: Partially open
- Living area and kitchen connected
- Bedroom isolated
- Bathroom completely separated

**Cover Scarcity**: Moderate
- Living area lacks defensive positions
- Kitchen provides good cover
- Bedroom adequately protected

Sightline Analysis (7.5/10)
**Vantage Points**: Strong positioning available
- Kitchen counter provides high vantage point
- Balcony offers external perspective
- Bedroom window secure observation

**Coverage Area**: Good visibility throughout
- 70% of property visible from main areas
- Blind spots limited to small corners
- Mirror placement enhances coverage

**Blind Spots**: Few problematic areas
- Small corner behind bedroom door
- Area under kitchen table
- Closet interiors

**Intersection Control**: Good junction control
- Central hallway controls all movement
- Kitchen access point critical
- Multiple crossing points manageable

Key Recommendations

1. **Strengthen Hallway Defense**: Add furniture blocking to reduce approach angles
2. **Enhance Window Security**: Consider mirror placement for exterior monitoring
3. **Optimize Resource Routes**: Create efficient gathering paths through kitchen
4. **Secondary Position**: Develop bedroom as secondary defensive position
5. **Communication Points**: Establish sight lines between key areas

Final Assessment

This modern apartment presents a well-rounded tactical environment with good defensive positioning opportunities and moderate resource distribution. The open floor plan provides visibility advantages while the segmented bedroom and bathroom offer retreat options. Recommended for tactical analysis: High priority.
  `
}

export default function ListingDetail({ params }: { params: { id: string } }) {
  const [expandedReport, setExpandedReport] = useState(false)
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'ready' | 'playing'>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const listing = mockListingDetails // In production, fetch based on params.id

  const generateNarrative = (): string => {
    return `Welcome to the tactical analysis of ${listing.title} located in ${listing.location}. This property has received an overall score of ${listing.overallScore} out of 10. Let me walk you through the key findings.

Starting with Choke Points, this property scored ${listing.chokePoints} out of 10. Choke points represent defensible positions and hallway control. The narrow corridor leading to main rooms provides good defensive positioning with limited approach vectors from the entrance.

Next, Loot Spawns scored ${listing.lootSpawns} out of 10. Resources are moderately distributed throughout the property. The kitchen contains the primary resources with secondary locations in the bedroom and bathroom.

Flank Vulnerability received a score of ${listing.flankVulnerability} out of 10. This metric evaluates exposure and vulnerability to flanking attacks. The property has moderate exposure through windows and balcony doors, with limited blind entry routes.

Finally, Sightline Analysis scored ${listing.sightlineAnalysis} out of 10. Strong vantage points are available from the kitchen counter and balcony, providing good visibility throughout the property with the open floor plan.

In summary, this is a well-rounded tactical environment with good defensive positioning opportunities. The property balances visibility with cover, making it a recommendable location for tactical analysis.`
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
              <h1 className="text-4xl font-bold font-tomorrow text-foreground">{listing.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>{listing.type}</span>
                </div>
                <span className="text-sm">Submitted by {listing.submittedBy} on {listing.submittedAt}</span>
              </div>
            </div>

            {/* Main Layout - Floor Plan (Sticky) + Analysis (Scrollable) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Floor Plan - Sticky on Desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden border border-border">
                    <img
                      src={listing.floorPlanImage}
                      alt="Floor Plan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Floor Plan
                  </button>
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
                      <p className="text-3xl font-bold text-primary">{listing.chokePoints}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Loot Spawns</p>
                      <p className="text-3xl font-bold text-primary">{listing.lootSpawns}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Flank Vulnerability</p>
                      <p className="text-3xl font-bold text-primary">{listing.flankVulnerability}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sightline Analysis</p>
                      <p className="text-3xl font-bold text-primary">{listing.sightlineAnalysis}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {listing.overallScore}/10
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
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-lg text-foreground">{listing.description}</p>
                </div>

                {/* Analysis Report - Collapsible on Mobile */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  {/* Mobile Header - Collapsible */}
                  <button
                    onClick={() => setExpandedReport(!expandedReport)}
                    className="lg:hidden w-full flex items-center justify-between gap-2 text-left"
                  >
                    <h2 className="text-2xl font-bold text-foreground">Full Analysis Report</h2>
                    <ChevronDown
                      className={`w-6 h-6 text-foreground transition-transform ${
                        expandedReport ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Header - Always visible */}
                  <h2 className="hidden lg:block text-2xl font-bold text-foreground">Full Analysis Report</h2>

                  {/* Report Content - Collapsible on Mobile, Always Visible on Desktop */}
                  <div
                    className={`overflow-y-auto lg:overflow-visible transition-all lg:max-h-none ${
                      expandedReport ? 'max-h-[70vh]' : 'max-h-0 lg:max-h-none'
                    }`}
                  >
                    <div className="space-y-4">
                      {listing.analysisReport.split('\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('##')) {
                          return (
                            <h2 key={idx} className="text-2xl font-bold text-foreground mt-6 mb-4">
                              {paragraph.replace(/^##\s/, '')}
                            </h2>
                          )
                        } else if (paragraph.startsWith('###')) {
                          return (
                            <h3 key={idx} className="text-xl font-bold text-foreground mt-4 mb-2">
                              {paragraph.replace(/^###\s/, '')}
                            </h3>
                          )
                        } else if (paragraph.startsWith('-')) {
                          return (
                            <ul key={idx} className="list-disc list-inside text-foreground ml-2">
                              <li>{paragraph.replace(/^-\s/, '')}</li>
                            </ul>
                          )
                        } else if (paragraph.startsWith('**') && paragraph.includes(':')) {
                          const [bold, rest] = paragraph.split(':')
                          return (
                            <p key={idx} className="text-foreground">
                              <strong>{bold.replace(/\*\*/g, '')}</strong>:{rest}
                            </p>
                          )
                        } else if (
                          paragraph.startsWith('1.') ||
                          paragraph.startsWith('2.') ||
                          paragraph.startsWith('3.') ||
                          paragraph.startsWith('4.') ||
                          paragraph.startsWith('5.')
                        ) {
                          return (
                            <p key={idx} className="text-foreground ml-4">
                              {paragraph}
                            </p>
                          )
                        } else if (paragraph.trim()) {
                          return (
                            <p key={idx} className="text-foreground">
                              {paragraph}
                            </p>
                          )
                        }
                        return null
                      })}
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
