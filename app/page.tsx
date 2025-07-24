import FAQ from "@/components/faq"
import Hero from "@/components/hero"
import { ServicesSection } from "@/components/serivice-section"
import { WhyChooseSection } from "@/components/why-choose-section"

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <WhyChooseSection />
      <ServicesSection />
      <FAQ />
    </main>
  )
}
