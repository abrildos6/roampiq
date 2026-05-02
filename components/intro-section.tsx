"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

type IntroPanel = {
  letter: string
  label: string
  category: string
  image: string
}

const panels: IntroPanel[] = [
  { letter: "R", label: "Rostro", category: "rostro", image: "/images/rostro-syh-main.jpg" },
  { letter: "O", label: "Ordinary", category: "ordinary", image: "/images/ordinary-lsy-main.jpg" },
  { letter: "A", label: "Athletic", category: "athletic", image: "/images/athletic-sss-main.jpg" },
  { letter: "M", label: "coMing soon", category: "motion", image: "" },
]

const TRANSITION_DURATION = 1
// Desktop mouse: animation duration and nav delay are both halved
const DESKTOP_DURATION = 0.5
const TRANSITION_EASE = [0.22, 1, 0.36, 1] as const
const LETTER_STAGGER_MS = 120
const INTRO_HOLD_MS = 0

export function IntroSection() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // true only on a real mouse desktop: viewport > 1366px AND pointer: fine
  const [isDesktopMouse, setIsDesktopMouse] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tappedIndex, setTappedIndex] = useState<number | null>(null)
  const [introRevealed, setIntroRevealed] = useState<Set<number>>(new Set())
  const [showHint, setShowHint] = useState(false)
  const [isIntroDone, setIsIntroDone] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Track viewport so the intro photo choreography only runs on mobile (<640px).
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)")
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  // Detect true desktop mouse: wide viewport + fine pointer (not touch/stylus)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1367px) and (pointer: fine)")
    const update = () => setIsDesktopMouse(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    panels.forEach((panel) => {
      router.prefetch(`/work?category=${panel.category}`)
    })
  }, [router])

  // Intro choreography (mobile only): each letter briefly reveals its photo,
  // then the moment M appears all four photos snap away leaving the letters.
  useEffect(() => {
    if (!isLoaded) return
    if (!isMobile) {
      setIntroRevealed(new Set())
      setShowHint(true)
      setIsIntroDone(true)
      return
    }
    const timers: number[] = []
    panels.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setIntroRevealed((prev) => {
            const next = new Set(prev)
            next.add(i)
            return next
          })
        }, i * LETTER_STAGGER_MS)
      )
    })
    const fadeOutAt =
      (panels.length - 1) * LETTER_STAGGER_MS + TRANSITION_DURATION * 1000 + INTRO_HOLD_MS
    timers.push(
      window.setTimeout(() => {
        setIntroRevealed(new Set())
        setShowHint(true)
      }, fadeOutAt)
    )
    timers.push(
      window.setTimeout(() => {
        setIsIntroDone(true)
      }, fadeOutAt + TRANSITION_DURATION * 1000)
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [isLoaded, isMobile])

  const handleNavigate = (index: number, category: string) => {
    if (tappedIndex !== null) return
    setTappedIndex(index)
    // Desktop mouse: 0.5s total. Touch (phone + tablet): 1s.
    const delayMs = isDesktopMouse ? DESKTOP_DURATION * 1000 : TRANSITION_DURATION * 1000
    window.setTimeout(() => {
      router.push(`/work?category=${category}`)
    }, delayMs)
  }

  const tapDuration = isDesktopMouse ? DESKTOP_DURATION : TRANSITION_DURATION

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-background">
      {/* Top brand mark — appears alongside the bottom hint after the intro */}
      <div
        className={`pointer-events-none absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 transition-all duration-1000 ${
          showHint ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h1 className="hidden sm:block text-sm tracking-[0.3em] uppercase text-foreground/40 font-normal">ROAM</h1>
        <span className="hidden sm:inline text-sm tracking-[0.3em] uppercase text-foreground/40">
          Visual Storytelling
        </span>
      </div>

      {/* 4-panel splash: vertical columns on desktop, horizontal rows on mobile */}
      <div className="absolute inset-0 z-10 flex flex-col sm:flex-row">
        {panels.map((panel, index) => {
          const isTapped = tappedIndex === index
          const isIntroRevealed = introRevealed.has(index)
          const isInteractive = hoveredIndex === index || isTapped
          const isHovered = isInteractive || isIntroRevealed
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index && !isTapped

          return (
            <motion.a
              key={panel.letter}
              href={panel.image ? `/work?category=${panel.category}` : undefined}
              onClick={(event) => {
                if (!panel.image) { event.preventDefault(); return }
                event.preventDefault()
                handleNavigate(index, panel.category)
              }}
              onMouseEnter={() => tappedIndex === null && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => tappedIndex === null && setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              whileTap={{ opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isTapped ? 0.5 : isLoaded ? 1 : 0 }}
              transition={{
                duration: isTapped ? tapDuration : TRANSITION_DURATION,
                ease: TRANSITION_EASE,
                delay: isLoaded && !isTapped ? index * 0.12 : 0,
              }}
              aria-label={`Enter ${panel.label} gallery`}
              className="group relative flex-1 overflow-hidden border-foreground/10 sm:border-r sm:last:border-r-0 border-b last:border-b-0 sm:border-b-0"
            >
              {/* Photo always covers the panel (scale >= 1) so no black edge appears.
                  Darkness baked in via CSS filter so opacity fades don't shift brightness. */}
              {panel.image && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 origin-center"
                  style={{
                    backgroundImage: `url(${panel.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: (["50% 25%", "center", "50% 25%", "50% 10%"])[index],
                  }}
                  initial={{ opacity: 0, scale: 1.1, filter: "brightness(0.15)" }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isTapped
                      ? 1
                      : isHovered
                        ? 1.25
                        : !isIntroDone
                          ? 1.25
                          : 1.1,
                    filter: isInteractive ? "brightness(0.6)" : "brightness(0.15)",
                  }}
                  transition={{
                    opacity: { duration: isTapped ? tapDuration : TRANSITION_DURATION, ease: "easeInOut" },
                    scale: { duration: isTapped ? tapDuration : TRANSITION_DURATION, ease: TRANSITION_EASE },
                    filter: { duration: isTapped ? tapDuration : TRANSITION_DURATION, ease: "easeInOut" },
                  }}
                />
              )}

              {/* Letter + label stay anchored to the full panel */}
              <div
                className={`relative z-10 flex h-full w-full flex-col items-center justify-center transition-all duration-1000 ${
                  isDimmed ? "opacity-40" : "opacity-100"
                }`}
              >
                <span
                  className={`select-none font-light leading-none text-foreground text-[22vw] sm:text-[14vw] md:text-[12vw] transition-transform duration-1000 ease-out ${
                    isHovered ? "scale-[1.02] tracking-tight" : "scale-100"
                  }`}
                  style={{ fontFeatureSettings: '"ss01"' }}
                >
                  {panel.letter}
                </span>
                <span
                  className={`mt-2 sm:mt-4 text-[10px] sm:text-xs tracking-[0.35em] text-foreground/90 transition-all duration-1000 ${
                    panel.image ? "uppercase" : "normal-case"
                  } ${
                    isInteractive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  {panel.label}
                </span>
              </div>
            </motion.a>
          )
        })}
      </div>

      {/* Bottom hint — appears after the intro photos fade out */}
      <div
        className={`pointer-events-none absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex justify-center transition-all duration-1000 ${
          showHint ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[10px] sm:text-sm tracking-[0.3em] uppercase text-foreground/40">
          Select a chapter
        </span>
      </div>
    </section>
  )
}
