"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { useLanguage, type Language } from "@/contexts/language-context"
import { Terminal, Globe } from "lucide-react"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [showLanguageSelect, setShowLanguageSelect] = useState(true)
  const [progress, setProgress] = useState(0)
  const { language, setLanguage, t } = useLanguage()

  // Handle language selection - automatically proceed after selection
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    setShowLanguageSelect(false)

    // Start progress animation and automatically proceed
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10 // Faster progress
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)

        // Automatically complete after a short delay
        setTimeout(() => {
          onComplete()
        }, 800)
      }
      setProgress(currentProgress)
    }, 80) // Faster interval
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <GlitchText
        text={t("welcome.title")}
        className="text-green-400 text-2xl md:text-4xl mb-2 font-mono"
        glitchInterval={2000}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-green-400 text-4xl md:text-6xl mb-12 font-mono"
      >
        {t("welcome.subtitle")}
      </motion.div>

      {/* Language Selection Screen */}
      {showLanguageSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-green-400/30 bg-black/50 p-6 max-w-md w-full"
        >
          <div className="flex items-center mb-4">
            <Terminal className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-green-400 font-mono text-sm">LANGUAGE_SELECT.exe</span>
          </div>

          <div className="font-mono text-green-400/70 text-sm mb-4">{t("welcome.select")}:</div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleLanguageSelect("en")}
              className={`flex items-center p-3 border ${language === "en" ? "border-green-400 bg-green-400/10" : "border-green-400/30 hover:border-green-400/70"} transition-colors`}
            >
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>English</span>
              {language === "en" && <span className="ml-auto text-green-400">✓</span>}
            </button>

            <button
              onClick={() => handleLanguageSelect("es")}
              className={`flex items-center p-3 border ${language === "es" ? "border-green-400 bg-green-400/10" : "border-green-400/30 hover:border-green-400/70"} transition-colors`}
            >
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>Español</span>
              {language === "es" && <span className="ml-auto text-green-400">✓</span>}
            </button>

            <button
              onClick={() => handleLanguageSelect("jp")}
              className={`flex items-center p-3 border ${language === "jp" ? "border-green-400 bg-green-400/10" : "border-green-400/30 hover:border-green-400/70"} transition-colors`}
            >
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>日本語</span>
              {language === "jp" && <span className="ml-auto text-green-400">✓</span>}
            </button>

            <button
              onClick={() => handleLanguageSelect("pt")}
              className={`flex items-center p-3 border ${language === "pt" ? "border-green-400 bg-green-400/10" : "border-green-400/30 hover:border-green-400/70"} transition-colors`}
            >
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>Português</span>
              {language === "pt" && <span className="ml-auto text-green-400">✓</span>}
            </button>
            <button
              onClick={() => handleLanguageSelect("fr")}
              className={`flex items-center p-3 border ${language === "fr" ? "border-green-400 bg-green-400/10" : "border-green-400/30 hover:border-green-400/70"} transition-colors`}
            >
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>Français</span>
              {language === "fr" && <span className="ml-auto text-green-400">✓</span>}
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading Screen - shown after language selection */}
      {!showLanguageSelect && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full">
          <div className="w-full h-1 bg-green-900 mb-4 relative overflow-hidden">
            <motion.div className="absolute top-0 left-0 h-full bg-green-400" style={{ width: `${progress}%` }} />
          </div>

          <div className="text-green-400 text-sm font-mono">
            {progress < 100 ? "Connecting to the Wired..." : "Connection established"}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 50 ? 1 : 0 }}
        className="absolute bottom-8 text-green-400/50 text-xs font-mono max-w-md text-center px-4"
      >
        "Close your eyes and relax. Let your consciousness slowly drift away..."
      </motion.div>
    </div>
  )
}