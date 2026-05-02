"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 w-8 h-8 flex items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/60 hover:text-foreground transition-all duration-500 text-xs cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      ↑
    </button>
  )
}

function WorkPageInner() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("rostro")

  useEffect(() => {
    const cat = searchParams.get("category")
    if (cat) {
      setActiveCategory(cat)
      requestAnimationFrame(() => {
        document.getElementById("work")?.scrollIntoView({ behavior: "auto" })
      })
    }
  }, [searchParams])

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    const workSection = document.getElementById("work")
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection initialCategory={activeCategory} onCategoryClick={handleCategoryClick} />
      <PortfolioGrid activeCategory={activeCategory} />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ScrollToTopButton />
    </main>
  )
}

export default function WorkPage() {
  return (
    <Suspense fallback={null}>
      <WorkPageInner />
    </Suspense>
  )
}
