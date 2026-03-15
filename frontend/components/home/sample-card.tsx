"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import GameButton from "@/components/ui/game-button"

export function SampleCard() {
  const metrics = [
    {
      title: "Choke Points",
      score: 78,
      description: "The \"Hall\" is the undisputed kill zone of this property. Because it's an L-shaped corridor, it forces visitors into a natural funnel with limited escape routes. The central Hall junction acts as a classic T-junction, making it a power position for control. However, with multiple exits from each room into the hall and balanced entry points, the score reflects strong defensive potential tempered by navigation flexibility.",
      factors: [
        { name: "Hallway Control", value: "30%", desc: "High. The central Hall junction is a classic T-junction." },
        { name: "Cover Density", value: "25%", desc: "Moderate. Doorway frames provide solid peek potential." },
        { name: "Multiple Exits", value: "25%", desc: "Excellent. Every room has its own door into the hall." },
        { name: "Entry Points", value: "20%", desc: "Low. Limited vectors for defenders to watch." },
      ]
    },
    {
      title: "Loot Spawns",
      score: 84,
      description: "This property is exceptionally resource-rich in the center, making mid-game positioning crucial. The Kitchen and two dedicated Store closets are perfectly clustered for strategic resource management. The Kitchen island offers 360-degree waist-high cover while looting, and the central location means you can restock utilities without venturing into exposed areas. This high score reflects the exceptional balance between accessibility and defensive cover during resource gathering phases.",
      factors: [
        { name: "Resource Clustering", value: "35%", desc: "High. Kitchen and stores centrally located." },
        { name: "Accessibility", value: "25%", desc: "High. Quick grab while holding main area." },
        { name: "Storage Capacity", value: "20%", desc: "Excellent. Multiple dedicated storage rooms." },
        { name: "Defense Rating", value: "20%", desc: "High. Kitchen island offers 360° cover." },
      ]
    },
    {
      title: "Flank Vulnerability",
      score: 62,
      description: "The open-concept Kitchen/Living/Dining area presents a serious vulnerability if the balcony is compromised. The Living Room features three separate window and door vectors, creating extreme sightline exposure. While the L-shaped hallway offers some protection, an opponent breaching from the bedroom balcony could flank the entire defensive line. The moderate score reflects this high-risk scenario: strong defensive positions exist, but coordinated attacks from multiple angles can overwhelm traditional holding positions.",
      factors: [
        { name: "Sightline Exposure", value: "30%", desc: "Extreme. Multiple window/door vectors expose players." },
        { name: "Blind Entry Routes", value: "25%", desc: "Moderate. Bedroom balcony enables flanks." },
        { name: "Open Concept Layout", value: "25%", desc: "Dead zone with very few partition walls." },
        { name: "Cover Scarcity", value: "20%", desc: "Moderate. Soft cover won't stop high-caliber rounds." },
      ]
    },
    {
      title: "Sightline Analysis",
      score: 72,
      description: "The doorway between the Hall and the Living Room emerges as the dominant vantage point, offering a true power position. From this location, a defender can monitor the balcony, kitchen, and main entrance simultaneously—covering approximately 70% of the property's movement vectors. The dark zones (En Suite and interior Bedroom 2) create perfect camping spots for opponents. The \"L\" bend intersection in the hallway represents the critical rotation point, making this score reflect strong anchor positions with manageable blind spots.",
      factors: [
        { name: "Vantage Points", value: "30%", desc: "Hall/Living Room doorway is a power position." },
        { name: "Coverage Area", value: "28%", desc: "From central hallway, monitor 70% of apartment." },
        { name: "Blind Spots", value: "22%", desc: "En Suite and Bedroom 2 are dark zones." },
        { name: "Intersection Control", value: "20%", desc: "L-bend in hall is the intersection of death." },
      ]
    }
  ]

  const [showAnalysis, setShowAnalysis] = useState(false)

  return (
    <section id="examples" className="w-full py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold font-tomorrow text-foreground">
            See it in action
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete tactical property analysis.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 overflow-hidden">
          {/* Property Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground">Moorbridge Road, Maidenhead</h3>
            <p className="text-sm text-muted-foreground mt-1">Tactical Valuation Report</p>
          </div>

          {/* Side-by-side layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Floorplan Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                <img 
                  src="/example_floorplan.jpeg" 
                  alt="Property floorplan" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Tactical Analysis */}
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="border-b border-border pb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-tomorrow font-bold text-primary">76.5</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Tactical Score</p>
                <p className="text-sm text-foreground mt-3 leading-relaxed">
                  High risk, high reward scenario. Asymmetrical multi-wing layout with excellent resources but vulnerable flanks.
                </p>
              </div>

              {/* Metric Scores Grid */}
              <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.title} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="text-2xl font-bold text-primary mb-1">{metric.score}</div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{metric.title}</p>
                  </div>
                ))}
              </div>

              {/* Key Insights with View Report Button */}
              <div className="border-t border-border pt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Key Tactical Insights</p>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• <strong>Hall Junction:</strong> Classic T-junction kill zone for defense</li>
                    <li>• <strong>Loot-Heavy:</strong> Central kitchen/stores provide resources</li>
                    <li>• <strong>Balcony Threat:</strong> Sniper exposure from multiple vectors</li>
                    <li>• <strong>Power Position:</strong> Hall/Living Room doorway anchors the map</li>
                  </ul>
                </div>
                <div className="flex md:flex-col items-center justify-center md:h-32 md:flex-shrink-0">
                  <GameButton 
                    onClick={() => setShowAnalysis(true)}
                    size="sm"
                  >
                    View Report
                  </GameButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Analysis Report Dialog */}
        <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
          <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-tomorrow">Full Tactical Analysis Report</DialogTitle>
              <DialogDescription>Moorbridge Road, Maidenhead - Detailed Breakdown</DialogDescription>
            </DialogHeader>

            <div className="space-y-8 mt-6">
              {metrics.map((metric) => (
                <div key={metric.title} className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-xl font-bold font-tomorrow text-foreground">
                      {metric.title}: {metric.score}/100
                    </h3>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">
                    {metric.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metric.factors.map((factor) => (
                      <div key={factor.name} className="p-3 bg-muted/40 rounded border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-foreground text-sm">{factor.name}</p>
                          <Badge variant="secondary" className="text-xs">{factor.value}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{factor.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
