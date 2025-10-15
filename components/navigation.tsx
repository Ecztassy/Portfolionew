"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { createPortal } from "react-dom"
import { useLanguage } from "@/contexts/language-context"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const langCtx = useLanguage()
  const { t } = langCtx ?? { t: (k: string) => k }

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    if (isOpen) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen, mounted])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = useMemo(
    () => [
      { id: "home", label: t("nav.home") ?? "Home" },
      { id: "about", label: t("nav.about") ?? "About" },
      { id: "projects", label: t("nav.projects") ?? "Projects" },
      { id: "skills", label: t("nav.skills") ?? "Skills" },
      { id: "contact", label: t("nav.contact") ?? "Contact" },
    ],
    [t]
  )

  // mobile overlay/menu JSX (portal content)
  const mobileMenuNode = isOpen ? (
    <>
      {/* background overlay */}
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[10050] bg-black/60 md:hidden"
        onClick={() => setIsOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* slide-down menu */}
      <motion.div
        key="mobileMenu"
        className="fixed top-10 left-0 right-0 bottom-0 z-[10060] md:hidden flex flex-col"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      >
        <div className="flex-1 pt-4 pb-6 px-4 space-y-4 overflow-auto bg-black/95">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id)
                setIsOpen(false)
              }}
              className={`block w-full text-left px-3 py-4 font-mono text-base border-b border-green-400/20 focus:outline-none ${
                activeSection === item.id ? "text-green-400" : "text-green-400/60"
              }`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  ) : null

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[10000] transition-colors duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-sm border-b border-green-400/20" : "bg-transparent"
        }`}
        initial={false}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    onSectionChange("home")
                    setIsOpen(false)
                  }}
                  className="text-green-400 font-mono text-xl focus:outline-none"
                  aria-label="Go to home"
                >
                  PORTFOLIO
                </button>
              </div>
            </div>

            {/* Desktop links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`font-mono text-sm px-2 lg:px-3 py-2 relative focus:outline-none ${
                      activeSection === item.id ? "text-green-400" : "text-green-400/60 hover:text-green-400/80"
                    }`}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                        layoutId="activeSection"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu toggle (works reliably) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="p-2 rounded-md text-green-400 hover:text-green-400/80 focus:outline-none"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Portal for overlay and menu */}
      {mounted && createPortal(<AnimatePresence>{mobileMenuNode}</AnimatePresence>, document.body)}
    </>
  )
}
