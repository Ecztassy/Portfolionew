"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"

export function TerminalContact() {
  const { t } = useLanguage()
  const [input, setInput] = useState("")
  const [conversation, setConversation] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: t("terminal.connection") },
    { type: "output", text: t("terminal.helpPrompt") },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Update initial conversation when language changes
  useEffect(() => {
    setConversation([
      { type: "output", text: t("terminal.connection") },
      { type: "output", text: t("terminal.helpPrompt") },
    ])
  }, [t])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user input to conversation
    setConversation((prev) => [...prev, { type: "input", text: input }])

    // Process command
    processCommand(input)

    // Clear input
    setInput("")
  }

  const processCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()

    setIsTyping(true)

    setTimeout(() => {
      let response = ""

      switch (command) {
        case "help":
          response = t("terminal.help")
          break

        case "about":
          response = t("terminal.about")
          break

        case "contact":
          response = t("terminal.contact")
          break

        case "projects":
          response = t("terminal.projects")
          break

        case "clear":
          setConversation([
            { type: "output", text: t("terminal.cleared") },
            { type: "output", text: t("terminal.helpPrompt") },
          ])
          setIsTyping(false)
          return

        case "exit":
          response = t("terminal.exit")
          setTimeout(() => {
            setConversation([
              { type: "output", text: t("terminal.connection") },
              { type: "output", text: t("terminal.helpPrompt") },
            ])
          }, 2000)
          break

        default:
          response = t("terminal.notRecognized").replace("{command}", command)
      }

      setConversation((prev) => [...prev, { type: "output", text: response }])
      setIsTyping(false)
    }, 500)
  }

  useEffect(() => {
    // Scroll to bottom when conversation updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <div className="border border-green-400/30 bg-black/50 h-[300px] sm:h-[400px] flex flex-col">
      <div className="border-b border-green-400/30 p-2 flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
        <span className="text-green-400 font-mono text-sm">{t("terminal.title")}</span>
      </div>

      <div ref={terminalRef} className="flex-1 p-4 font-mono text-green-400 overflow-auto">
        {conversation.map((message, index) => (
          <div className="mb-2" key={index}>
            {message.type === "input" ? (
              <div>
                <span className="text-green-400/70">{">"} </span>
                <span>{message.text}</span>
              </div>
            ) : (
              <div className="text-green-400/90 whitespace-pre-line mb-2">{message.text}</div>
            )}
          </div>
        ))}

        {isTyping && <div className="animate-pulse">{t("terminal.processing")}</div>}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-green-400/30 p-2 flex">
        <span className="text-green-400/70 mr-2">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
          placeholder={t("terminal.placeholder")}
        />
      </form>
    </div>
  )
}

