"use client"

import { useState, useEffect, useRef } from "react"

interface TerminalTextProps {
  text: string
  className?: string
  typingSpeed?: number
  startDelay?: number
}

export function TerminalText({ text, className = "", typingSpeed = 30, startDelay = 0 }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const textRef = useRef(text)

  useEffect(() => {
    textRef.current = text

    if (typingSpeed === 0) {
      setDisplayedText(text)
      return
    }

    let timeout: NodeJS.Timeout

    const startTyping = () => {
      setIsTyping(true)
      setDisplayedText("")

      let i = 0
      const type = () => {
        if (i < textRef.current.length) {
          setDisplayedText((prev) => prev + textRef.current.charAt(i))
          i++
          timeout = setTimeout(type, typingSpeed)
        } else {
          setIsTyping(false)
        }
      }

      timeout = setTimeout(type, typingSpeed)
    }

    const delayTimeout = setTimeout(startTyping, startDelay)

    return () => {
      clearTimeout(timeout)
      clearTimeout(delayTimeout)
    }
  }, [text, typingSpeed, startDelay])

  return (
    <div className={`font-mono ${className}`}>
      {displayedText}
      {isTyping && <span className="animate-pulse">_</span>}
    </div>
  )
}

