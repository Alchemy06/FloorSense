"use client"

import { useState } from "react"
import { Crosshair, Shield, Zap, Eye, ChevronRight, ChevronDown } from "lucide-react"

const features = [
  {
    icon: Crosshair,
    title: "Choke Points",
    description: "Identify defensible positions. Rate how easily you can hold hallways and entrances against incoming threats.",
    rubric: {
      criteria: [
        {
          name: "Hallway Control",
          description: "Narrow corridors that can only be approached from limited angles",
          weight: "30%"
        },
        {
          name: "Cover Density",
          description: "Available barriers and obstacles for defensive positioning",
          weight: "25%"
        },
        {
          name: "Multiple Exits",
          description: "Retreat routes and emergency escape paths available",
          weight: "25%"
        },
        {
          name: "Entry Points",
          description: "Number of doorways and approach vectors to defend",
          weight: "20%"
        }
      ]
    }
  },
  {
    icon: Shield,
    title: "Loot Spawns",
    description: "Kitchen islands, storage closets, cover positions. Every tactical advantage mapped and scored.",
    rubric: {
      criteria: [
        {
          name: "Resource Clustering",
          description: "How densely packed valuable items are in specific zones",
          weight: "35%"
        },
        {
          name: "Accessibility",
          description: "Ease of reaching resources without compromising position",
          weight: "25%"
        },
        {
          name: "Storage Capacity",
          description: "Total volume and number of storage locations",
          weight: "20%"
        },
        {
          name: "Defense Rating",
          description: "Cover and protection while gathering resources",
          weight: "20%"
        }
      ]
    }
  },
  {
    icon: Zap,
    title: "Flank Vulnerability",
    description: "Open-concept exposure. Sniper sightlines, approach vectors, and undefended entry points analyzed.",
    rubric: {
      criteria: [
        {
          name: "Sightline Exposure",
          description: "Direct lines of sight from exterior windows and entrances",
          weight: "30%"
        },
        {
          name: "Blind Entry Routes",
          description: "Undefended paths for enemies to approach undetected",
          weight: "25%"
        },
        {
          name: "Open Concept Layout",
          description: "Large rooms without partition walls or obstacles",
          weight: "25%"
        },
        {
          name: "Cover Scarcity",
          description: "Lack of defensive positions in main areas",
          weight: "20%"
        }
      ]
    }
  },
  {
    icon: Eye,
    title: "Sightline Analysis",
    description: "Visual dominance scoring. See which positions extract maximum information from the property.",
    rubric: {
      criteria: [
        {
          name: "Vantage Points",
          description: "Elevated or central positions with maximum visibility",
          weight: "30%"
        },
        {
          name: "Coverage Area",
          description: "Percentage of property visible from key positions",
          weight: "28%"
        },
        {
          name: "Blind Spots",
          description: "Areas out of sight from primary sightlines (negative factor)",
          weight: "22%"
        },
        {
          name: "Intersection Control",
          description: "Key hallway junctions controlling multiple zones",
          weight: "20%"
        }
      ]
    }
  },
]

export function Features() {
  const [expandedRubric, setExpandedRubric] = useState<{ [key: number]: boolean }>({})

  const toggleRubric = (idx: number) => {
    setExpandedRubric(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  return (
    <section id="features" className="w-full py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold font-tomorrow text-foreground">
            Tactical metrics that matter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We analyze properties through a competitive gaming lens, not traditional real estate.
          </p>
        </div>

        {/* Features with alternating layout */}
        <div className="space-y-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            const isEven = idx % 2 === 0

            return (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Content side */}
                <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>

                {/* Rubric breakdown side */}
                <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                  <div className="bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                    {/* Card header - clickable on mobile */}
                    <button
                      onClick={() => toggleRubric(idx)}
                      className="w-full md:cursor-default md:pointer-events-none flex items-start justify-between gap-3 p-8 text-left"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg">Scoring Rubric</h4>
                        <p className="text-sm text-muted-foreground mt-1">Some factors that influence how we calculate the {feature.title.toLowerCase()} score</p>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-muted-foreground md:hidden flex-shrink-0 transition-transform mt-1 ${expandedRubric[idx] ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Rubric criteria - collapsible on mobile, always expanded on tablet+ */}
                    <div className={`border-t border-border/50 overflow-hidden transition-all md:max-h-none ${
                      expandedRubric[idx] ? 'max-h-96' : 'max-h-0'
                    }`}>
                      <div className="space-y-4 p-8">
                        {feature.rubric.criteria.map((criterion, criterionIdx) => (
                          <div key={criterionIdx} className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2 flex-1">
                                <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-foreground text-sm">{criterion.name}</h5>
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {criterion.description}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                {criterion.weight}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
