"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, type Transition } from "framer-motion"
import { Play } from "lucide-react"
import { portfolioItems } from "@/lib/portfolio-data"

interface PortfolioGridProps {
  activeCategory: string
}

type MotionConfig = {
  initial: Record<string, number>
  animate: Record<string, number>
  transition: { duration: number; ease: string; delay: number }
}

function getCategoryMotion(category: string, index: number): MotionConfig {
  switch (category) {
    case "ordinary":
    case "athletic":
    case "rostro":
    default:
      return {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 2.0, ease: "easeOut" as const, delay: 0.3 + index * 0.2 },
      }
  }
}

function PortfolioItem({
  item,
  index,
}: {
  item: (typeof portfolioItems)[0]
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const anim = getCategoryMotion(item.category, index)

  const getAspectRatio = () => {
    switch (item.aspectRatio) {
      case "portrait":
        return "aspect-[3/4]"
      case "square":
        return "aspect-square"
      case "landscape":
      default:
        return "aspect-[4/3]"
    }
  }

  return (
    <motion.article
      className="group relative cursor-pointer mb-4 sm:mb-6 break-inside-avoid"
      initial={anim.initial}
      animate={anim.animate}
      transition={anim.transition as Transition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/project/${item.id}`}>
        <div className={`relative overflow-hidden ${getAspectRatio()}`}>
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
          <div
            className={`absolute inset-0 bg-background/60 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {item.type === "video" && (
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? "opacity-100 scale-100" : "sm:opacity-0 sm:scale-90"
              }`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 border border-foreground/40 bg-background/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-foreground ml-0.5" />
              </div>
            </div>
          )}

          <div
            className={`absolute inset-0 p-4 sm:p-6 hidden sm:flex flex-col justify-end transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-foreground/60 tracking-wider uppercase mb-2">
                  {item.category}
                </p>
                <h3 className="text-lg sm:text-xl text-foreground font-light">
                  {item.title}
                </h3>
              </div>
              <span className="text-xs sm:text-sm text-foreground/40">{item.year}</span>
            </div>
          </div>
        </div>

        <div className="sm:hidden py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                {item.category}
              </p>
              <h3 className="text-base text-foreground font-light">{item.title}</h3>
            </div>
            <span className="text-xs text-muted-foreground">{item.year}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function PortfolioGrid({ activeCategory }: PortfolioGridProps) {
  const filteredItems =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="work" className="min-h-screen bg-background px-4 py-16 sm:px-6 sm:py-24 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-16">
          <h2 className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">
            Selected Work
          </h2>
          <p className="text-xl sm:text-2xl sm:text-3xl text-foreground font-light leading-relaxed max-w-2xl text-balance">
          People, movement, and atmosphere<br />
          captured through photography and film.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <PortfolioItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
