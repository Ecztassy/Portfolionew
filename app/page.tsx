"use client"

import { useState, useRef, useEffect, useMemo, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProjectCategories } from "@/components/project-categories"
import { GlitchText } from "@/components/glitch-text"
import { SkillsSection } from "@/components/skills-section"
import { AboutSection } from "@/components/about-section"
import { TerminalContact } from "@/components/terminal-contact"
import { Footer } from "@/components/footer"
import { ArrowDown } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { WelcomeScreen } from "@/components/welcome-screen"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

// lightweight dynamic imports (client-only) for heavy 3D components
const MatrixBackground = dynamic(
  () => import("@/components/matrix-background").then((mod) => mod.default || mod.MatrixBackground),
  { ssr: false }
)

const LazyProjectGrid = dynamic(
  () => import("@/components/project-grid").then((mod) => mod.ProjectGrid),
  { ssr: true, loading: () => <div>Loading projects…</div> }
)

// 3D components as client-only dynamic imports to avoid adding them to initial bundle
const DesktopScene = dynamic(() => import("@/components/desktop-scene").then((m) => m.DesktopScene), {
  ssr: false,
  loading: () => null,
})
const FloppyDisk = dynamic(() => import("@/components/floppy-disk").then((m) => m.FloppyDisk), {
  ssr: false,
  loading: () => null,
})
const DreiEnvironment = dynamic(() => import("@react-three/drei").then((m) => m.Environment), {
  ssr: false,
  loading: () => null,
})
const DreiOrbit = dynamic(() => import("@react-three/drei").then((m) => m.OrbitControls), {
  ssr: false,
  loading: () => null,
})
const CanvasWrapper = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), {
  ssr: false,
  loading: () => null,
})

// Age calculation helper
function getAge(birthdate: string, overrideAge: number | null = null): number {
  if (overrideAge !== null) {
    return overrideAge
  }
  const parts = birthdate.split("-").map(Number)
  if (parts.length !== 3) return -1
  const [day, month, year] = parts
  const birth = new Date(year, month - 1, day)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--
  }
  return age
}

// small hook to detect when an element is in the viewport
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            obs.disconnect()
            return
          }
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

export default function Home() {
  const { t } = useLanguage()
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const [activeCategory, setActiveCategory] = useState("all")
  const [ageOverride, setAgeOverride] = useState<number | null>(null)
  const [age, setAge] = useState<number | null>(null)

  // ✅ Always call hooks before any conditional return
  const [heroRef, heroInView] = useInView(0.2)
  const [contactRef, contactInView] = useInView(0.2)

  const aboutText = useMemo(() => {
    if (age === null) return ""
    return t("about.p1").replace("{{age}}", age.toString())
  }, [age, t])

  useEffect(() => {
    if (!showWelcome) {
      const birthdate = "17-12-2007" // DD-MM-YYYY
      const calculated = getAge(birthdate, ageOverride)
      setAge(calculated)
    }
  }, [showWelcome, ageOverride])

  // Suppress verbose logs in production
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.log = () => {}
      console.warn = () => {}
    }
  }, [])

  // Smooth scroll when nav changes
  useEffect(() => {
    const section = document.getElementById(activeSection)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeSection])

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            if (id) setActiveSection(id)
          }
        }
      },
      { threshold: 0.4 }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  const getDpr = useCallback(() => {
    if (typeof window === "undefined") return 1
    return Math.min(1.5, window.devicePixelRatio || 1)
  }, [])

  // ✅ Conditional rendering AFTER all hooks
  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />
  }

  if (age === null || age === -1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-400 font-mono">
        {age === -1 ? "Error calculating age" : "Loading..."}
      </div>
    )
  }

  return (
    <div className="bg-black text-green-400 min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <MatrixBackground />
      </div>

      {/* Navigation */}
      <div
        className="fixed top-0 left-0 right-0 z-[99999] pointer-events-auto will-change-transform translate-z-0"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <GlitchText text={t("hero.title")} className="text-xl md:text-2xl mb-2 font-mono" />
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("hero.subtitle")}</h1>
                <p className="text-green-400/70 mb-6 font-mono">{t("hero.description")}</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setActiveSection("projects")}
                    className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors"
                  >
                    {t("hero.viewProjects")}
                  </button>
                  <button
                    onClick={() => setActiveSection("about")}
                    className="px-4 py-2 bg-green-400/20 text-green-400 hover:bg-green-400/30 transition-colors"
                  >
                    {t("hero.aboutMe")}
                  </button>
                </div>
              </div>

              <div ref={heroRef as any} className="order-1 md:order-2 h-[300px] md:h-[500px]">
                {heroInView ? (
                  <Suspense fallback={<div className="h-full flex items-center justify-center text-green-400/40">Loading 3D…</div>}>
                    <CanvasWrapper dpr={getDpr()} camera={{ position: [0, 0, 4.5], fov: 75 }} gl={{ antialias: true }}>
                      <ambientLight intensity={0.9} />
                      <pointLight position={[5, 5, 5]} intensity={0.6} />
                      <DesktopScene />
                      <DreiEnvironment preset="night" />
                      <DreiOrbit enableZoom={false} enablePan={false} />
                    </CanvasWrapper>
                  </Suspense>
                ) : (
                  <div className="h-full flex items-center justify-center text-green-400/40">3D preview</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="text-green-400/50" />
        </motion.div>
      </section>

      {/* About Section */}
      <AboutSection aboutText={aboutText} />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <GlitchText text={t("projects.title")} className="text-3xl md:text-4xl font-bold mb-4" />
            <p className="text-green-400/70 max-w-2xl mx-auto">{t("projects.description")}</p>
          </div>

          <ProjectCategories onCategoryChange={setActiveCategory} />

          <div className="mt-12">
            <LazyProjectGrid activeCategory={activeCategory} pageSize={10} />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <GlitchText text={t("contact.title")} className="text-3xl md:text-4xl font-bold mb-4" />
            <p className="text-green-400/70 max-w-2xl mx-auto">{t("contact.description")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div ref={contactRef as any} className="h-[300px] sm:h-[400px] bg-black/30">
              {contactInView ? (
                <Suspense fallback={<div className="h-full flex items-center justify-center text-green-400/40">Loading…</div>}>
                  <CanvasWrapper dpr={getDpr()} gl={{ antialias: true }}>
                    <ambientLight intensity={0.8} />
                    <pointLight position={[6, 6, 6]} intensity={0.8} />
                    <FloppyDisk />
                    <DreiEnvironment preset="night" />
                  </CanvasWrapper>
                </Suspense>
              ) : (
                <div className="h-full flex items-center justify-center text-green-400/40">Contact preview</div>
              )}
            </div>
            <TerminalContact />
          </div>
        </div>
      </section>

      <div className="mt-12 w-full md:max-w-[80%] mx-auto">
        <ContactForm />
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  )
}
