import {
  Header,
  Hero,
  Features,
  HowItWorks,
  SampleCard,
  Footer,
} from "@/components/home"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <SampleCard />
      </main>
      <Footer />
    </div>
  )
}
