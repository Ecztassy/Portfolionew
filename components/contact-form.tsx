"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { sendContactEmail } from "../app/actions/contact"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function ContactForm() {
  const { t } = useLanguage()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")

    try {
      // Basic validation
      if (!formState.name.trim()) throw new Error("Name is required")
      if (!formState.email.trim()) throw new Error("Email is required")
      if (!/^\S+@\S+\.\S+$/.test(formState.email)) throw new Error("Invalid email format")
      if (!formState.message.trim()) throw new Error("Message is required")

      // Send the email
      const result = await sendContactEmail(formState)

      if (result.success) {
        setStatus("success")
        setFormState({
          name: "",
          email: "",
          message: "",
        })
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div className="border border-green-400/30 bg-black/50 p-6 h-full">
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <GlitchText text={t("contact.form.success")} className="text-xl font-bold mb-4" />
          <p className="text-green-400/70 mb-6">{t("contact.form.successDesc")}</p>
          <button
            onClick={() => setStatus("idle")}
            className="px-4 py-2 border border-green-400/50 text-green-400 hover:bg-green-400/10 transition-colors"
          >
            {t("contact.form.sendAnother")}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="mb-2">
            <GlitchText text={t("contact.form.title")} className="text-xl font-bold" />
            <p className="text-green-400/70 text-sm mt-1">{t("contact.form.subtitle")}</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-mono text-green-400/70 mb-1">
              {t("contact.form.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              disabled={status === "submitting"}
              className="w-full bg-black border border-green-400/30 p-2 text-green-400 focus:border-green-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-mono text-green-400/70 mb-1">
              {t("contact.form.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              disabled={status === "submitting"}
              className="w-full bg-black border border-green-400/30 p-2 text-green-400 focus:border-green-400 focus:outline-none font-mono"
            />
          </div>

          <div className="flex-grow">
            <label htmlFor="message" className="block text-xs font-mono text-green-400/70 mb-1">
              {t("contact.form.message")}
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              disabled={status === "submitting"}
              rows={5}
              className="w-full h-[calc(100%-1.5rem)] bg-black border border-green-400/30 p-2 text-green-400 focus:border-green-400 focus:outline-none font-mono resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 transition-colors font-mono flex items-center justify-center disabled:opacity-50"
          >
            {status === "submitting" ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("contact.form.sending")}
              </span>
            ) : (
              <span className="flex items-center">
                <span>{t("contact.form.send")}</span>
                <Send className="w-4 h-4 ml-2" />
              </span>
            )}
          </button>

          <div className="text-xs text-green-400/50 font-mono pt-2">
            <div className="mb-1">
              {">"} {t("skills.connectionSecure")}
            </div>
            <div>
              {">"} {t("skills.encryptionEnabled")}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

