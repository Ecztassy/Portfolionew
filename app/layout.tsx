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
  keywords: ["Portfolio", "Professional", "cybersecurity", "Frontend", "Backend", "Linux", "Lain"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'
