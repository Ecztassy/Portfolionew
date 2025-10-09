"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { useLanguage } from "@/contexts/language-context"
type AboutSectionProps = {
  aboutText: string
}

export function AboutSection({ aboutText }: AboutSectionProps){
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="about" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1" // Fix mobile order
          >
            <GlitchText text={t("about.title")} className="text-3xl md:text-4xl font-bold mb-6" />

            <div className="space-y-4">
              <div className="text-green-400/90">{aboutText}</div>

              <div className="text-green-400/80">{t("about.p2")}</div>

              <div className="text-green-400/70">{t("about.p3")}</div>

              <div className="pt-4">
                <div className="text-green-400/60 italic">{t("about.quote")}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative order-1 md:order-2" // Fix mobile order
          >
            <div className="border border-green-400/30 p-1 bg-black">
              <div className="aspect-square relative overflow-hidden">
                {/* Use a static image that will always display */}
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <img
                    src="/images/me.jpg"
                    alt="Lain"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = "none"
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        const fallback = document.createElement("div")
                        fallback.className = "text-green-400 text-center p-8"
                        fallback.innerHTML = `
                          <div class="text-xl mb-4">Me</div>
                          <div class="text-sm opacity-70">Keep the focus</div>
                        `
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>

                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none bg-scanline opacity-20"></div>

                {/* Terminal overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="font-mono text-xs text-green-400/80">
                    <div>
                      {">"} {t("about.terminal.identity")}
                    </div>
                    <div>
                      {">"} {t("about.terminal.connection")}
                    </div>
                    <div>
                      {">"} {t("about.terminal.present")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border border-green-400/20 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-green-400/20 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

