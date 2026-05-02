"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen bg-background px-4 py-16 sm:px-6 sm:py-24 sm:px-12 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8">Contact</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-light leading-tight mb-8 sm:mb-12 text-balance">
            {"Let’s create visual stories in motion."}
          </h3>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="space-y-8">
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">Email</p>
              <a href="mailto:roampiq@naver.com" className="group flex items-center gap-2 text-lg sm:text-xl text-foreground hover:text-foreground/70 transition-colors">
                roampiq@naver.com
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">Location</p>
              <p className="text-lg sm:text-xl text-foreground">Seoul, South Korea</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">Availability</p>
              <p className="text-lg sm:text-xl text-foreground">Open for selected projects</p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-6">Follow</p>
            <div className="space-y-4">
              <a href="https://www.instagram.com/roam.piq/" className="group flex items-center justify-between py-4 border-b border-border hover:border-foreground transition-colors">
                <span className="flex items-center gap-3 text-foreground">
                  <InstagramIcon className="w-5 h-5" />
                  @roam.piq
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}