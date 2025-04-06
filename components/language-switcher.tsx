"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Languages } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/language-context"
import { GlitchText } from "./glitch-text"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [glitching, setGlitching] = useState(false)

  // Language options with their display names
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "jp", name: "日本語" },
    { code: "pt", name: "Português" },
    { code: "fr", name: "Français"},
  ]

  const handleLanguageChange = (lang: Language) => {
    if (lang === language) return

    // Trigger glitch effect during language change
    setGlitching(true)
    setLanguage(lang)

    // Update the html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }

    // Close dropdown after a short delay
    setTimeout(() => {
      setIsOpen(false)
      setGlitching(false)
    }, 500)
  }

  // Also set the lang attribute on initial load
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Main button with pulsing effect */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-black border border-green-400/30 px-4 py-2 text-green-400 hover:bg-green-400/10 transition-colors shadow-lg shadow-green-400/20"
        >
          <Languages className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">
            {glitching ? (
              <GlitchText
                text={languages.find((l) => l.code === language)?.name || "Language"}
                intensity="medium"
                glitchInterval={100}
              />
            ) : (
              languages.find((l) => l.code === language)?.name || "Language"
            )}
          </span>

          {/* Pulsing dot */}
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 right-0 w-40 bg-black border border-green-400/30 overflow-hidden shadow-lg shadow-green-400/10"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as Language)}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between ${
                    language === lang.code ? "bg-green-400/10 text-green-400" : "text-green-400/70 hover:bg-green-400/5"
                  }`}
                >
                  <span className="font-mono text-sm">{lang.name}</span>
                  {language === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}