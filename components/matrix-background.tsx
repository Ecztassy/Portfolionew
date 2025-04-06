"use client"

import { useEffect, useRef } from "react"

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Get the canvas element
    const canvas = canvasRef.current
    if (!canvas) {
      console.warn("Canvas element not found")
      return
    }

    // Get the canvas context
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.warn("Could not get canvas context")
      return
    }

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      if (canvas && window) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    // Initial resize
    resizeCanvas()

    // Add event listener safely with a reference to the function
    const handleResize = () => {
      resizeCanvas()
    }

    // Only add event listener if window is defined (client-side)
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
    }

    // Matrix characters - Japanese katakana and some Latin characters
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const fontSize = 16 // Increased from 14 to make more noticeable
    const columns = Math.floor(canvas.width / fontSize)

    // Array to track the y position of each column
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Drawing function
    const draw = () => {
      if (!ctx || !canvas) return

      // Semi-transparent black to create fade effect - reduced opacity to make characters more visible
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)" // Changed from 0.05 to 0.03 for slower fade
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text color and font - brighter green
      ctx.fillStyle = "#00ff9d" // Pure green color
      ctx.font = `bold ${fontSize}px monospace` // Added monospace and fixed font size

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)]

        // Draw the character with a glow
        ctx.shadowBlur = 5
        ctx.shadowColor = "#00ff9d"
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        ctx.shadowBlur = 0

        // Move the drop down
        drops[i]++

        // Reset drop position with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20)
        }
      }
    }

    // Animation loop - slightly faster for more noticeable movement
    const interval = setInterval(draw, 40) // Changed from 50 to 40 for faster animation

    // Cleanup function
    return () => {
      clearInterval(interval)
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export default MatrixBackground

