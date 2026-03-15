"use client"

const steps = [
  {
    number: "01",
    title: "Send property URL or upload a floor plan",
    description: "Enter any Rightmove URL or upload a floor plan image. We automatically extract and analyze the layout.",
  },
  {
    number: "02",
    title: "Custom Analysis",
    description: "Gemini vision API analyzes the layout with tactical scoring algorithms.",
  },
  {
    number: "03",
    title: "Get your score",
    description: "Receive a tactical valuation with detailed breakdowns of each metric. Listen to custom scenarios with ElevenLabs voiceover.",
  },
]

export function HowItWorks() {
  return (
    <>
      {/* Top SVG tilt triangle divider */}
      <div className="w-full hidden md:block" style={{ lineHeight: 0, background: 'white' }}>
        <svg
          width="100%"
          height="100"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <polygon points="0,8 100,8 100,0" fill="#000000" />
        </svg>
      </div>

      {/* How it works section */}
      <section id="how-it-works" className="w-full py-32 px-6" style={{ background: '#000000' }}>
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold font-tomorrow text-white">
              How it works
            </h2>
            <p className="text-lg text-gray-300">
              Three simple steps to tactical analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="space-y-4">
                <div className="text-5xl font-tomorrow font-bold text-white">{step.number}</div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom SVG tilt triangle divider */}
      <div className="w-full hidden md:block" style={{ lineHeight: 0, background: '#000000' }}>
        <svg
          width="100%"
          height="100"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <polygon points="0,8 100,8 100,0" fill="white" />
        </svg>
      </div>
    </>
  )
}
