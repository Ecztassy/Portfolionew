"use client"

import { motion } from "framer-motion"
import { LanguageSelector } from "./language-selector"

export function FloatingLanguageSelector() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <LanguageSelector variant="full" className="shadow-lg" />
    </motion.div>
  )
}

