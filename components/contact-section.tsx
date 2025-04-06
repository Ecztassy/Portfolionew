"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { TerminalText } from "./terminal-text"
import { ContactForm } from "./contact-form"
import { Github, Mail } from "lucide-react"

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="contact" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <GlitchText text="CONTACT" className="text-3xl md:text-4xl font-bold mb-4" />
          <p className="text-green-400/70 max-w-2xl mx-auto">Connect with me through the Wired.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
              <TerminalText
                text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."
                className="text-green-400/70"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-green-400" />
                <a
                  href="mailto:contact@example.com"
                  className="text-green-400/80 hover:text-green-400 transition-colors"
                >
                  contact@example.com
                </a>
              </div>

              <div className="flex items-center">
                <Github className="w-5 h-5 mr-4 text-green-400" />
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400/80 hover:text-green-400 transition-colors"
                >
                  github.com/username
                </a>
              </div>
            </div>

            <div className="pt-4">
              <div className="font-mono text-xs text-green-400/60 border border-green-400/30 p-4 bg-black/50">
                <div>{">"} Connection request received</div>
                <div>{">"} Establishing secure channel</div>
                <div>{">"} Ready to receive transmission</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="h-full w-full bg-[url('/images/terminal-bg.png')] bg-repeat" />
      </div>
    </section>
  )
}

