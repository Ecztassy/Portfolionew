"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/language-context"

interface LanguageSelectorProps {
  variant?: "minimal" | "full"
  className?: string
}

export function LanguageSelector({ variant = "full", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Get language display name
  const getLanguageName = (lang: Language) => {
    switch (lang) {
      case "en":
        return "English"
      case "es":
        return "Español"
      case "jp":
        return "日本語"
      case "pt":
        return "Português"
      case "fr":
        return "Français"
      default:
        return "English"
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center text-green-400/80 hover:text-green-400 transition-colors ${
          variant === "minimal" ? "p-2" : "px-3 py-2 border border-green-400/30 hover:bg-green-400/10"
        }`}
        aria-label="Select language"
      >
        <Globe className={`${variant === "minimal" ? "w-5 h-5" : "w-4 h-4 mr-2"}`} />
        {variant !== "minimal" && <span className="font-mono text-sm">{getLanguageName(language)}</span>}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-black border border-green-400/30 shadow-lg z-50"
          >
            <button
              onClick={() => handleLanguageChange("en")}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                language === "en" ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
              }`}
            >
              <span>English</span>
              {language === "en" && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleLanguageChange("es")}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                language === "es" ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
              }`}
            >
              <span>Español</span>
              {language === "es" && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleLanguageChange("jp")}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                language === "jp" ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
              }`}
            >
              <span>日本語</span>
              {language === "jp" && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleLanguageChange("pt")}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                language === "pt" ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
              }`}
            >
              <span>Português</span>
              {language === "pt" && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleLanguageChange("fr")}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                language === "fr" ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
              }`}
            >
              <span>Français</span>
              {language === "fr" && <Check className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}