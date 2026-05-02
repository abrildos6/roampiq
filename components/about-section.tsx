"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mobileColor, setMobileColor] = useState(false)

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

  useEffect(() => {
    if (!isVisible) return
    const isMobile = window.matchMedia("(max-width: 639px)").matches
    if (!isMobile) return
    const timer = setTimeout(() => setMobileColor(true), 5000)
    return () => clearTimeout(timer)
  }, [isVisible])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen bg-background px-4 py-16 sm:px-6 sm:py-24 sm:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div
            className={`relative aspect-[4/5] overflow-hidden transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/about.jpg"
              alt="About ROAM"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className={`object-cover transition-all duration-700 sm:grayscale sm:hover:grayscale-0 ${mobileColor ? "grayscale-0" : "grayscale"}`}
            />
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8">About</h2>
            <h3 className="text-[17.5px] sm:text-[17.5px] md:text-[24px] text-foreground font-light leading-relaxed mb-6 sm:mb-8 text-balance">
            <br />ROAM explores people, movement and atmosphere
            through photography and film.<br />

<br />Focused on athletic, lifestyle, and everyday scenes,<br />
ROAM captures rhythm, tension, and motion.
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[13.3px] sm:text-[14.5px] md:text-[16px]">
              <p><br /><br />ROAM은 사람, 움직임, 공간의 분위기를 사진과 영상으로 기록합니다.</p>
              <p>애슬레틱, 라이프스타일, 일상의 장면 안에서
              리듬과 긴장감, 움직임을 포착합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}