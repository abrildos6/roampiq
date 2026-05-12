"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react"
import { getPortfolioItem, type PortfolioItem } from "@/lib/portfolio-data"

function Thumbnail({
  src,
  alt,
  onClick,
}: {
  src: string
  alt: string
  onClick: () => void
}) {
  const [ratio, setRatio] = useState<number | null>(null)

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full overflow-hidden cursor-pointer group block break-inside-avoid mb-4 sm:mb-6"
      style={{ aspectRatio: ratio ?? 4 / 3 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        onLoadingComplete={(img) => {
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight)
          }
        }}
      />
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
    </button>
  )
}

function Lightbox({
  images,
  index,
  title,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  title: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") onPrev()
      else if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-foreground/60 tracking-[0.2em] uppercase">
        {title} — {index + 1} / {images.length}
      </div>

      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous image"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
      >
        <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center px-12 sm:px-20 py-16">
        <div className="relative w-full h-full max-w-[90vw] max-h-[85vh]">
          <Image
            src={images[index]}
            alt={`${title} - ${index + 1}`}
            fill
            className="object-contain"
            sizes="90vw"
            quality={95}
            priority
          />
        </div>
      </div>
    </div>
  )
}

function MobileScrollToTopButton() {
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
      className={`fixed bottom-4 right-4 z-50 w-8 h-8 sm:hidden flex items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/60 hover:text-foreground transition-all duration-500 text-xs cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      ↑
    </button>
  )
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<PortfolioItem | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const id = params.id as string
    const item = getPortfolioItem(id)
    if (item) {
      setProject(item)
      setTimeout(() => setIsLoaded(true), 100)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || !project) return i
      return (i - 1 + project.images.length) % project.images.length
    })
  }, [project])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || !project) return i
      return (i + 1) % project.images.length
    })
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border border-foreground/20 border-t-foreground animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 sm:px-12 bg-background/80 backdrop-blur-sm">
        <Link
          href={project.category ? `/work?category=${project.category}#work` : "/work#work"}
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors tracking-wider uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : "Work"}</span>
        </Link>
        <Link href="/" className="text-lg sm:text-xl font-light tracking-widest uppercase text-foreground">ROAM</Link>
        <div className="w-20" />
      </header>

      <section className="px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-10 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="sm:col-span-2">
              <p className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] uppercase mb-4">{project.category}</p>
              <h1 className="text-3xl sm:text-4xl sm:text-5xl text-foreground font-light mb-6 sm:mb-8">{project.title}</h1>
              {project.description && (
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{project.description}</p>
              )}
            </div>
            <div className="space-y-6 sm:border-l sm:border-border sm:pl-8">
              <div>
                <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">Year</p>
                <p className="text-foreground">{project.year}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">Type</p>
                <p className="text-foreground capitalize">{project.type}</p>
              </div>
              {project.client && (
                <div>
                  <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">Client</p>
                  <p className="text-foreground">{project.client}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-8 sm:pb-24 lg:px-16">
        <div className={`mx-auto transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 lg:gap-8">
            {project.images.map((image, index) => (
              <Thumbnail
                key={index}
                src={image}
                alt={`${project.title} - Image ${index + 1}`}
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 sm:px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ROAM. All rights reserved.</p>
          <Link href="/work#contact" className="text-xs text-foreground hover:text-foreground/70 transition-colors tracking-wider uppercase">Get in touch</Link>
        </div>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox
          images={project.images}
          index={lightboxIndex}
          title={project.title}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
      <MobileScrollToTopButton />
    </main>
  )
}
