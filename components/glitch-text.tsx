"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
  glitchInterval?: number
  intensity?: "none" | "low" | "medium" | "high"
  preserveContent?: boolean
}

export function GlitchText({
  text,
  className = "",
  glitchInterval = 5000,
  intensity = "low",
  preserveContent = true,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const textRef = useRef(text)

  useEffect(() => {
    textRef.current = text
    setDisplayText(text)

    if (intensity === "none") return

    const interval = setInterval(() => {
      setIsGlitching(true)

      // Generate glitched text based on intensity
      const glitchText = textRef.current
        .split("")
        .map((char, index) => {
          // Adjust probability based on intensity
          const glitchProbability = intensity === "low" ? 0.05 : intensity === "medium" ? 0.15 : 0.3

          // Always preserve first character if preserveContent is true
          if (preserveContent && index === 0) return char

          if (Math.random() < glitchProbability) {
            const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\`~"
            return chars[Math.floor(Math.random() * chars.length)]
          }
          return char
        })
        .join("")

      setDisplayText(glitchText)

      // Reset after a short time
      setTimeout(() => {
        setIsGlitching(false)
        setDisplayText(textRef.current)
      }, 150)
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [text, glitchInterval, intensity, preserveContent])

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        x: isGlitching && intensity !== "none" ? [0, -2, 2, -1, 1, 0] : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      {displayText}
      {isGlitching && intensity !== "none" && intensity !== "low" && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-full text-red-500 opacity-20 mix-blend-screen"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 33%, 0 33%)" }}
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 0.1 }}
          >
            {displayText}
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 w-full h-full text-blue-500 opacity-20 mix-blend-screen"
            style={{ clipPath: "polygon(0 66%, 100% 66%, 100% 100%, 0 100%)" }}
            animate={{ x: [1, -1, 1] }}
            transition={{ duration: 0.1 }}
          >
            {displayText}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

