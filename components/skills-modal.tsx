"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { GlitchText } from "./glitch-text"
import { useLanguage } from "@/contexts/language-context"

interface Skill {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  technologies: string[]
  details?: string
}

interface SkillsModalProps {
  skill: Skill | null
  skills: Skill[]
  isOpen: boolean
  onClose: () => void
}

export function SkillsModal({ skill, skills, isOpen, onClose }: SkillsModalProps) {
  const { t, language } = useLanguage()
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(skill)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  useEffect(() => {
    setCurrentSkill(skill)
  }, [skill])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleNext = () => {
    if (!currentSkill) return

    setDirection("right")
    const currentIndex = skills.findIndex((s) => s.id === currentSkill.id)
    const nextIndex = (currentIndex + 1) % skills.length

    setTimeout(() => {
      setCurrentSkill(skills[nextIndex])
      setDirection(null)
    }, 300)
  }

  const handlePrev = () => {
    if (!currentSkill) return

    setDirection("left")
    const currentIndex = skills.findIndex((s) => s.id === currentSkill.id)
    const prevIndex = (currentIndex - 1 + skills.length) % skills.length

    setTimeout(() => {
      setCurrentSkill(skills[prevIndex])
      setDirection(null)
    }, 300)
  }

  if (!currentSkill) return null

  // Check if language is Japanese for special styling
  const isJapanese = language === "jp"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-3xl bg-black border border-green-400/30 p-6 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-green-400/70 hover:text-green-400 transition-colors"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSkill.id}
                initial={{
                  x: direction === "right" ? 100 : direction === "left" ? -100 : 0,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: direction === "right" ? -100 : direction === "left" ? 100 : 0,
                  opacity: 0,
                }}
                transition={{ type: "spring", damping: 20 }}
                className="px-8" // Added padding to avoid overlap with navigation arrows
              >
                <div className="flex items-start mb-6">
                  <div className="mr-6 text-green-400 text-4xl">{currentSkill.icon}</div>
                  <div className="flex-1 min-w-0">
                    <GlitchText
                      text={currentSkill.title}
                      className={`text-2xl font-bold mb-3 ${isJapanese ? "skills-title" : ""}`}
                      intensity="low"
                      preserveContent={true}
                    />
                    <div className={`text-green-400/80 mb-4 ${isJapanese ? "skills-description" : ""}`}>
                      {currentSkill.description}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-mono text-green-400/50 mb-2">{t("skills.technologies")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSkill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 border border-green-400/30 text-green-400/80 bg-black"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-green-400/20 pt-4 mt-4">
                  <h4 className="text-sm font-mono text-green-400/70 mb-3">{t("skills.detailedInfo")}</h4>
                  <div className={`font-mono text-sm text-green-400/60 ${isJapanese ? "skills-modal-content" : ""}`}>
                    <p>{currentSkill.details || t("skills.noAdditionalInfo")}</p>
                  </div>
                </div>

                {/* Terminal decoration */}
                <div className="mt-6 font-mono text-xs text-green-400/40 border-t border-green-400/20 pt-4">
                  <div className="mb-1">
                    {">"} {t("skills.profileLoaded")}
                  </div>
                  <div>
                    {">"} {t("skills.connectionSecure")}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <button
                onClick={handlePrev}
                className="p-2 text-green-400/50 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <button
                onClick={handleNext}
                className="p-2 text-green-400/50 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

