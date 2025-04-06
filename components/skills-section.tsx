"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { Code, Cpu, Database, Layout } from "lucide-react"
import { SkillsModal } from "./skills-modal"
import { useLanguage } from "@/contexts/language-context"

export function SkillsSection() {
  const { t, language } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Define skills with translations
  const skills = [
    {
      id: "frontend",
      title: t("skills.frontend.title"),
      description: t("skills.frontend.description"),
      icon: <Layout className="w-8 h-8" />,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Svelte", "Laravel"],
      details: t("skills.frontend.details"),
    },
    {
      id: "backend",
      title: t("skills.backend.title"),
      description: t("skills.backend.description"),
      icon: <Code className="w-8 h-8" />,
      technologies: ["Java", "C", "C#", "Rust", "C++"],
      details: t("skills.backend.details"),
    },
    {
      id: "database",
      title: t("skills.database.title"),
      description: t("skills.database.description"),
      icon: <Database className="w-8 h-8" />,
      technologies: ["MongoDB", "PostgreSQL", "PHP", "SQLite", "MySQL"],
      details: t("skills.database.details"),
    },
    {
      id: "ai",
      title: t("skills.ai.title"),
      description: t("skills.ai.description"),
      icon: <Cpu className="w-8 h-8" />,
      technologies: [
        "Docker",
        "Kubernetes",
        "QEMU",
        "Systemd",
        "Dotfiles",
      ],
      details: t("skills.ai.details"),
    },
  ]

  const openModal = (skill: any) => {
    setSelectedSkill(skill)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Add extra class for Japanese text to handle overflow
 

  return (
    <section id="skills" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <GlitchText
            text={t("skills.title")}
            className="text-3xl md:text-4xl font-bold mb-4"
            intensity="low"
            preserveContent={true}
          />
          <p className="text-green-400/70 max-w-2xl mx-auto">{t("skills.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-green-400/30 p-6 bg-black/50 relative group cursor-pointer"
              onClick={() => openModal(skill)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start mb-4">
                <div className="mr-4 text-green-400">{skill.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-bold mb-2 ? "skills-title" : ""}`}>{skill.title}</h3>
                  <div className={`text-green-400/70 text-sm ? "skills-description" : ""}`}>
                    {skill.description}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-mono text-green-400/50 mb-2">{t("skills.technologies")}</h4>
                <div className="flex flex-wrap gap-2 p-3">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 border border-green-400/30 text-green-400/80 bg-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 border border-green-400/0 group-hover:border-green-400/50 pointer-events-none transition-colors duration-300"></div>

              {/* View more indicator */}
              <div className="absolute bottom-3 right-3 text-xs text-green-400/50 group-hover:text-green-400/80 transition-colors">
                <span className="font-mono">{t("skills.viewDetails")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="h-full w-full bg-[url('/images/terminal-bg.png')] bg-repeat" />
      </div>

      {/* Skills Modal */}
      <SkillsModal skill={selectedSkill} skills={skills} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}

