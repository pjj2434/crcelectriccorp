import FAQ from "@/components/faq"
import Hero from "@/components/hero"
import ThumbTackReviews from "@/components/thumbtack"
import { WhyChooseSection } from "@/components/why-choose-section"
import { Suspense, lazy } from "react"

// Lazy load the services section
const ServicesSection = lazy(() => import("@/components/serivice-section"))

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <WhyChooseSection />
      <Suspense fallback={
        <div className="bg-black py-20 md:py-28 lg:py-32 min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-red-600">Loading services...</p>
          </div>
        </div>
      }>
        <ServicesSection />
      </Suspense>
      <FAQ />
      <ThumbTackReviews/>
    </main>
  )
}
