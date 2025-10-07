import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My portfolio",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "Portfolio",
    "Professional",
    "Cybersecurity",
    "Frontend",
    "Backend",
    "Linux",
    "Lain",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload the GIF so it’s fetched immediately */}
        <link rel="preload" as="image" href="/images/lain.gif" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
