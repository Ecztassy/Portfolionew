"use client"

import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-8 px-4 border-t border-green-400/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-green-400 font-mono text-xl">PORTFOLIO</span>
        </div>

        <div className="text-center md:text-right">
          <p className="text-green-400/70 text-sm font-mono">{t("footer.presentDay")}</p>
          <p className="text-green-400/50 text-xs mt-1">
            &copy; {new Date().getFullYear()} · {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}

