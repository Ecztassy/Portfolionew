"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlitchText } from "./glitch-text"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Connecting to the Wired...")
  const loadingTexts = [
    "Connecting to the Wired...",
    "Scanning neural patterns...",
    "Establishing protocol layer...",
    "Synchronizing consciousness...",
    "Merging with the collective...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5
        return newProgress >= 100 ? 100 : newProgress
      })

      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)])
    }, 200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <GlitchText
        text="SERIAL EXPERIMENTS"
        className="text-green-400 text-2xl md:text-4xl mb-2 font-mono"
        glitchInterval={2000}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-green-400 text-4xl md:text-6xl mb-12 font-mono"
      >
        PORTFOLIO
      </motion.div>

      <div className="w-64 h-1 bg-green-900 mb-4 relative overflow-hidden">
        <motion.div className="absolute top-0 left-0 h-full bg-green-400" style={{ width: `${progress}%` }} />
      </div>

      <div className="text-green-400 text-sm font-mono">{loadingText}</div>

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

