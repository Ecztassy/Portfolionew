"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { motion, useScroll, useTransform } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProjectCategories } from "@/components/project-categories"
import { GlitchText } from "@/components/glitch-text"
import { ProjectGrid } from "@/components/project-grid"
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
import dynamic from "next/dynamic"

// Fix MatrixBackground import and add error handling for projects
const MatrixBackground = dynamic(
  () =>
    import("@/components/matrix-background")
      .then((mod) => mod.default || mod.MatrixBackground)
      .catch((err) => {
        console.error("Failed to load MatrixBackground:", err)
        return () => null // Return empty component on error
      }),
  { ssr: false },
)

// Modified getAge function: Now supports DD-MM-YYYY format (e.g., "17-12-2007").
// Added validation for invalid dates and optional overrideAge param to force a result (e.g., 17 for testing).
// This fixes the parsing bug that was causing ~18 due to invalid year/day rollover.
function getAge(birthdate: string, overrideAge: number | null = null): number {
  if (overrideAge !== null) {
    console.log(`[Age Override] Forcing age to ${overrideAge} (for testing/demo)`);
    return overrideAge; // Force the result (e.g., 17) if provided
  }

  console.log("Input birthdate:", birthdate); // Debug log

  // Parse as DD-MM-YYYY (changed order to match user's description/format)
  const parts = birthdate.split("-").map(Number);
  if (parts.length !== 3) {
    console.error("[Age Calc Error] Invalid date format. Expected DD-MM-YYYY like '17-12-2007'.");
    return -1; // Invalid input indicator
  }
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  console.log("Parsed day:", day, "month:", month, "year:", year); // Debug log

  // Validate basic ranges
  if (year < 1900 || year > new Date().getFullYear() || month < 1 || month > 12 || day < 1 || day > 31) {
    console.error("[Age Calc Error] Invalid date values (e.g., year too old/future, invalid month/day).");
    return -1;
  }

  // month is 0-based in JS Date constructor
  const birth = new Date(year, month - 1, day);
  // Validate the constructed date (handles cases like Feb 30)
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
    console.error("[Age Calc Error] Invalid date (e.g., Feb 30).");
    return -1;
  }

  console.log("Birth date object:", birth); // Debug log

  const now = new Date();
  console.log("Current date:", now); // Debug log

  let age = now.getFullYear() - birth.getFullYear();
  console.log("Initial age (year diff):", age); // Debug log

  const notHadBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());

  console.log("Not had birthday this year:", notHadBirthdayThisYear); // Debug log

  if (notHadBirthdayThisYear) {
    age--;
  }

  console.log("Final calculated age:", age); // Debug log
  return age;
}

export default function Home() {
  const { t } = useLanguage()
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeSection, setActiveSection] = useState("home") // Set "home" as default
  const [activeCategory, setActiveCategory] = useState("all")
  const [age, setAge] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // NEW: State for age override (for testing/demo; set to 17 to force it, or null for real calc)
  const [ageOverride, setAgeOverride] = useState<number | null>(null); // Change to 17 for testing

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.1], [0, -50])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)

    // Scroll to section
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  // Set initial category
  useEffect(() => {
    if (!showWelcome) {
      setActiveCategory("all")
    }
  }, [showWelcome])

  // Modified useEffect: Now calls getAge with DD-MM-YYYY format ("17-12-2007").
  // Passes ageOverride if set (e.g., to force 17).
  // Added more logging for React state updates.
  useEffect(() => {
    if (!showWelcome) {
      console.log("Calculating age after welcome...")
      const birthdate = "17-12-2007"; // Changed to DD-MM-YYYY to match your description
      const calculatedAge = getAge(birthdate, ageOverride);
      setAge(calculatedAge);
      console.log("Set age state to:", calculatedAge);
      console.log("About text with age:", t("about.p1").replace("{{age}}", calculatedAge.toString()));
    }
  }, [showWelcome, ageOverride, t]) // Added dependencies for override and t (for logging)

  // NEW: Optional useEffect to toggle override for testing (e.g., via console or button; remove in prod)
  useEffect(() => {
    // For testing: Uncomment to force 17 after 2 seconds (simulates after birthday)
    // setTimeout(() => setAgeOverride(17), 2000);
    // Or set immediately: setAgeOverride(17);
  }, []);

  console.log("Show welcome:", showWelcome)
  console.log("Age:", age)
  console.log("Age override active:", ageOverride); // NEW: Debug log

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (age === null || age === -1) { // Updated to handle invalid age (-1 from validation)
    // Show loading or placeholder while age is being calculated (or if invalid)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-400 font-mono">
        {age === -1 ? "Error calculating age - check console" : "Loading..."}
      </div>
    )
  }

  const aboutText = t("about.p1").replace("{{age}}", age.toString())
  console.log("About text with age:", aboutText)

  return (
    <div ref={containerRef} className="bg-black text-green-400 min-h-screen relative">
      {/* Matrix-like background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <MatrixBackground />
      </div>

      {/* Navigation */}
      <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div className="absolute inset-0 z-10" style={{ opacity: 1, scale, y }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-20 pointer-events-none" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <GlitchText text={t("hero.title")} className="text-xl md:text-2xl mb-2 font-mono" />
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("hero.subtitle")}</h1>
                <p className="text-green-400/70 mb-6 font-mono">{t("hero.description")}</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => handleSectionChange("projects")}
                    className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors"
                  >
                    {t("hero.viewProjects")}
                  </button>
                  <button
                    onClick={() => handleSectionChange("about")}
                    className="px-4 py-2 bg-green-400/20 text-green-400 hover:bg-green-400/30 transition-colors"
                  >
                    {t("hero.aboutMe")}
                  </button>
                </div>
              </div>

              <div className="order-1 md:order-2 h-[300px] md:h-[500px]">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 80 }}>
                  {/* Increased ambient light to make model more visible */}
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

          <ProjectCategories onCategoryChange={handleCategoryChange} />

          <div className="mt-12">
            <ProjectGrid activeCategory={activeCategory} />
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