"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Volume2, VolumeX, Play, Pause, Menu, X } from "lucide-react"

interface HeroSectionProps {
  onCategoryClick: (category: string) => void
  initialCategory?: string
}

const categories = [
  { id: "rostro", label: "ROSTRO" },
  { id: "ordinary", label: "ORDINARY" },
  { id: "athletic", label: "ATHLETIC" },
  { id: "motion", label: "COMING SOON" },
]

export function HeroSection({ onCategoryClick, initialCategory = "rostro" }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.play()
      } else {
        videoRef.pause()
      }
    }
  }, [isPlaying, videoRef])

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    onCategoryClick(categoryId)
    setIsMobileMenuOpen(false)
  }

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-background">
        <video
          ref={setVideoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/main-bg.mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <header
        className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 sm:px-12 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Link
          href="/"
          aria-label="Back to intro"
          className="text-foreground hover:opacity-80 transition-opacity cursor-pointer"
        >
          <h1 className="text-lg sm:text-xl font-medium tracking-[0.16em] uppercase">ROAM</h1>
        </Link>
        <nav className="hidden sm:flex items-center gap-8">
          <a
            href="#work"
            className="text-sm text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
          >
            Work
          </a>
          <a
            href="#about"
            className="text-sm text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-sm text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
          >
            Contact
          </a>
        </nav>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-background/98 backdrop-blur-md sm:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-3 text-foreground z-50"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <nav className="flex flex-col items-center gap-6">
            <a
              href="#work"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
            >
              Work
            </a>
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg text-foreground/80 hover:text-foreground hover:font-semibold transition-all tracking-wider uppercase cursor-pointer"
            >
              Contact
            </a>
          </nav>
          <div className="w-12 h-px bg-foreground/20" />
          <div className="flex flex-wrap justify-center gap-3 px-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 text-sm tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
                  activeCategory === category.id
                    ? "text-foreground border-foreground font-semibold"
                    : "text-foreground/60 border-foreground/20 hover:text-foreground hover:border-foreground/40 hover:font-semibold"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-xs sm:text-sm text-foreground/60 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">Visual Storytelling</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-foreground/50 text-center leading-tight tracking-tight text-balance">
        People, Movement,
          <br />
          <span className="text-foreground/40">Atmosphere</span>
        </h2>
      </div>

      {/* Category Navigation */}
      <nav
        className={`absolute bottom-24 left-0 right-0 z-10 hidden sm:flex justify-center transition-all duration-1000 delay-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm border border-foreground/10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeCategory === category.id
                  ? "text-foreground bg-foreground/10 font-semibold"
                  : "text-foreground/60 hover:text-foreground hover:font-semibold"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Category Pills */}
      <div
        className={`absolute bottom-20 left-0 right-0 z-10 sm:hidden px-4 transition-all duration-1000 delay-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeCategory === category.id
                  ? "text-foreground border-foreground bg-foreground/10 font-semibold"
                  : "text-foreground/60 border-foreground/20 hover:font-semibold"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20 flex items-center gap-2 sm:gap-3 transition-all duration-1000 delay-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 sm:p-2 text-foreground/60 hover:text-foreground transition-colors"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 sm:p-2 text-foreground/60 hover:text-foreground transition-colors"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block transition-all duration-1000 delay-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-foreground/40 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-foreground/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-foreground/60 animate-scroll" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}