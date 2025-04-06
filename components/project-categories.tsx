"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Globe, ComputerIcon, ServerIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { FaLinux } from "react-icons/fa"

interface ProjectCategoriesProps {
  onCategoryChange: (category: string) => void
}

export function ProjectCategories({ onCategoryChange }: ProjectCategoriesProps) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("all")
  const [isExpanded, setIsExpanded] = useState(true)
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialLoadRef = useRef(false)
  const mountedRef = useRef(false)

  // Define categories with translations and icons
  const categories = [
    { 
      id: "all", 
      label: t("projects.categories.all"), 
      icon: <Terminal className="w-5 h-5" /> 
    },
    { 
      id: "web", 
      label: t("projects.categories.web"), 
      icon: <Globe className="w-5 h-5" /> 
    },
    { 
      id: "software", 
      label: t("projects.categories.software"), 
      icon: <ComputerIcon className="w-5 h-5" /> 
    },
    { 
      id: "server", 
      label: t("projects.categories.server"), 
      icon: <ServerIcon className="w-5 h-5" /> 
    },
    { 
      id: "linux", 
      label: t("projects.categories.linux"), 
      icon: <FaLinux className="w-5 h-5" /> 
    },
  ]

  // Force re-render when language changes
  useEffect(() => {
    if (mountedRef.current) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }, [t])

  // Initial load - ensure categories are displayed by default
  useEffect(() => {
    mountedRef.current = true
    setIsLoading(true)

    const timer = setTimeout(() => {
      handleCategorySelect("all")
      setIsLoading(false)
      initialLoadRef.current = true
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === activeCategory) return

    setActiveCategory(categoryId)
    onCategoryChange(categoryId)
  }

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * categories.length)
      setGlitchIndex(randomIndex)

      setTimeout(() => {
        setGlitchIndex(null)
      }, 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [categories.length])

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="border border-green-400/30 bg-black/50 overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 border-b border-green-400/30 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <Terminal className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-green-400 font-mono text-sm">{t("projects.terminal.title")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400/30"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
          </div>
        </div>

        {/* Terminal Content - Always expanded by default */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              {isLoading ? (
                <div className="font-mono text-green-400/70 text-xs mb-3 animate-pulse">
                  <span>
                    {">"} {t("projects.terminal.loading")}
                  </span>
                </div>
              ) : (
                <>
                  <div className="font-mono text-green-400/70 text-xs mb-3">
                    <span>
                      {">"} {t("projects.selectCategory")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        className={`border cursor-pointer p-3 flex flex-col items-center justify-center text-center transition-colors ${
                          activeCategory === category.id
                            ? "border-green-400 bg-green-400/10"
                            : "border-green-400/30 hover:border-green-400/70 hover:bg-green-400/5"
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-green-400 mb-2">{category.icon}</div>
                        {glitchIndex === index ? (
                          <div className="text-green-400 font-mono text-xs">
                            {Array.from({ length: category.label.length })
                              .map((_, i) => String.fromCharCode(Math.floor(Math.random() * 26) + 65))
                              .join("")}
                          </div>
                        ) : (
                          <div className="text-green-400 font-mono text-xs">{category.label}</div>
                        )}

                        {activeCategory === category.id && (
                          <div className="mt-2 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="font-mono text-green-400/50 text-xs mt-4">
                    <span>
                      {">"} {t("projects.categorySelected")}: {categories.find((c) => c.id === activeCategory)?.label}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}