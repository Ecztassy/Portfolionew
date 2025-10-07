"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { ProjectCategories } from "@/components/project-categories"
import { GlitchText } from "@/components/glitch-text"
import { SkillsSection } from "@/components/skills-section"
import { AboutSection } from "@/components/about-section"
import { TerminalContact } from "@/components/terminal-contact"
import { Footer } from "@/components/footer"
import { ArrowDown } from "lucide-react"
import { FloppyDisk } from "@/components/floppy-disk"
import { DesktopScene } from "@/components/desktop-scene"
import { ContactForm } from "@/components/contact-form"
import { WelcomeScreen } from "@/components/welcome-screen"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Environment, OrbitControls } from "@react-three/drei"

// Lazy load background and project grid
const MatrixBackground = dynamic(
  () => import("@/components/matrix-background").then((mod) => mod.default || mod.MatrixBackground),
  { ssr: false }
)

const LazyProjectGrid = dynamic(
  () => import("@/components/project-grid").then((mod) => mod.ProjectGrid),
  { ssr: true, loading: () => <div>Loading projects…</div> }
)

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

export default function Home() {
  const { t } = useLanguage()
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const [activeCategory, setActiveCategory] = useState("all")
  const [ageOverride, setAgeOverride] = useState<number | null>(null)
  const [age, setAge] = useState<number | null>(null)

  // Memoize about text, so it only recalculates when age or translation changes
  const aboutText = useMemo(() => {
    if (age === null) return ""
    return t("about.p1").replace("{{age}}", age.toString())
  }, [age, t])

  // Compute age once after welcome ends (or when override changes)
  useEffect(() => {
    if (!showWelcome) {
      const birthdate = "17-12-2007" // DD-MM-YYYY
      const calculated = getAge(birthdate, ageOverride)
      setAge(calculated)
    }
  }, [showWelcome, ageOverride])

  // Suppress console logs in production globally for this page
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.log = () => {}
      console.warn = () => {}
    }
  }, [])

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
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
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

              <div className="order-1 md:order-2 h-[300px] md:h-[500px]">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 80 }}>
                  <ambientLight intensity={4} />
                  <pointLight position={[10, 10, 10]} intensity={2} />
                  <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00ff9d" />
                  <spotLight position={[0, 5, 5]} intensity={2} angle={0.3} penumbra={1} castShadow />
                  <DesktopScene position={[0, 0, 0]} />
                  <Environment preset="night" />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 2 - 0.5}
                    maxPolarAngle={Math.PI / 2 + 0.5}
                    minAzimuthAngle={-Math.PI / 4}
                    maxAzimuthAngle={Math.PI / 4}
                  />
                </Canvas>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <ArrowDown className="text-green-400/50" />
        </motion.div>

        <div className="absolute inset-0 bg-black/30 z-0">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[url('/images/terminal-bg.png')] bg-repeat" />
          </div>
        </div>
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

        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="h-full w-full bg-[url('/images/terminal-bg.png')] bg-repeat" />
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
            <div className="h-[300px] sm:h-[400px] bg-black/30">
              <Canvas>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <pointLight position={[-5, 5, 5]} intensity={1.5} color="#00ff9d" />
                <FloppyDisk position={[0, 0, 0]} />
                <Environment preset="night" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>

            <TerminalContact />
          </div>
        </div>

        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="h-full w-full bg-[url('/images/terminal-bg.png')] bg-repeat" />
        </div>
      </section>

      <div className="mt-12 w-full md:max-w-[80%] mx-auto">
        <ContactForm />
      </div>

      {/* Footer */}
      <Footer />

      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  )
}
