"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { animate } from "framer-motion"
import { GlitchText } from "./glitch-text"

const categories = [
  { id: "all", label: "ALL PROJECTS", icon: "🔍" },
  { id: "web", label: "WEB", icon: "🌐" },
  { id: "mobile", label: "MOBILE", icon: "📱" },
  { id: "design", label: "DESIGN", icon: "🎨" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "game", label: "GAME", icon: "🎮" },
  { id: "other", label: "OTHER", icon: "⚗️" },
]

interface ProjectWheelProps {
  onCategoryChange: (category: string) => void
}

export function ProjectWheel({ onCategoryChange }: ProjectWheelProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [showWheel, setShowWheel] = useState(true)
  const [wheelSize, setWheelSize] = useState(280)
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Calculate angle for each segment
  const segmentAngle = 360 / categories.length

  // Handle wheel toggle
  const handleWheelToggle = () => {
    setShowWheel(!showWheel)
  }

  // Ensure the wheel is responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        setWheelSize(240)
      } else if (window.innerWidth < 640) {
        setWheelSize(280)
      } else {
        setWheelSize(320)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle click on wheel to determine which segment was clicked
  const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating || !wheelRef.current) return

    // Get wheel center and click coordinates
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate angle of click relative to center
    const clickX = e.clientX - centerX
    const clickY = e.clientY - centerY
    const clickAngle = ((Math.atan2(clickY, clickX) * 180) / Math.PI + 360) % 360

    // Adjust for wheel rotation
    const adjustedAngle = (clickAngle - rotation + 360) % 360

    // Determine which segment was clicked
    const segmentIndex = Math.floor(adjustedAngle / segmentAngle)

    if (segmentIndex >= 0 && segmentIndex < categories.length) {
      const selectedCategory = categories[segmentIndex]
      handleCategorySelect(selectedCategory.id, segmentIndex)
    }
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string, index: number) => {
    if (isAnimating) return

    // Calculate the target rotation to bring the selected category to the top
    const currentRotation = rotation % 360
    const targetRotation = (index * segmentAngle + 270) % 360

    // Calculate the shortest path to the target rotation
    let rotationDelta = targetRotation - currentRotation

    // Adjust for shortest path
    if (rotationDelta > 180) rotationDelta -= 360
    if (rotationDelta < -180) rotationDelta += 360

    // Add extra rotation for a more satisfying spin (1-2 full rotations)
    const extraRotation = Math.sign(rotationDelta) * (360 + Math.random() * 360)
    const finalRotation = rotation + rotationDelta + extraRotation

    setIsAnimating(true)

    // Animate the rotation
    animate(rotation, finalRotation, {
      duration: 2,
      ease: [0.2, 0.9, 0.1, 1],
      onUpdate: (value) => setRotation(value),
      onComplete: () => {
        setIsAnimating(false)
        setActiveCategory(categoryId)
        onCategoryChange(categoryId)
      },
    })
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Selected Category Display */}
      <div className="w-full text-center mb-6">
        <GlitchText
          text={categories.find((c) => c.id === activeCategory)?.label || "ALL PROJECTS"}
          className="text-green-400 font-mono text-2xl md:text-3xl"
        />

        {/* Toggle Button */}
        <button
          onClick={handleWheelToggle}
          className="mt-4 px-4 py-2 border border-green-400/50 text-green-400 text-sm hover:bg-green-400/10 transition-colors"
        >
          {showWheel ? "Hide Selection Wheel" : "Show Selection Wheel"}
        </button>
      </div>

      {/* Wheel Container */}
      <div
        className={`relative flex justify-center items-center transition-all duration-300 ${
          showWheel ? "opacity-100" : "opacity-0 pointer-events-none scale-90"
        }`}
        style={{
          height: showWheel ? wheelSize + 40 : 0,
          width: showWheel ? wheelSize + 40 : 0,
          marginBottom: showWheel ? 80 : 0,
        }}
      >
        {/* Wheel Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-30">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-green-400"></div>
        </div>

        {/* Wheel Border */}
        <div
          className="absolute rounded-full border-2 border-green-400/70"
          style={{
            width: wheelSize + 10,
            height: wheelSize + 10,
            zIndex: 5,
          }}
        />

        {/* Spinning Wheel */}
        <div
          ref={wheelRef}
          className="absolute rounded-full border-2 border-green-400/70 bg-black overflow-hidden cursor-pointer"
          style={{
            width: wheelSize,
            height: wheelSize,
            transform: `rotate(${rotation}deg)`,
            zIndex: 10,
            transition: isAnimating ? "none" : "transform 0.5s ease-out",
          }}
          onClick={handleWheelClick}
        >
          {/* Wheel Segments */}
          {categories.map((category, index) => {
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const isActive = category.id === activeCategory

            // Calculate position for the category icon
            const iconAngle = (startAngle + endAngle) / 2
            const iconRadius = wheelSize * 0.35
            const iconX = Math.cos((iconAngle * Math.PI) / 180) * iconRadius + wheelSize / 2
            const iconY = Math.sin((iconAngle * Math.PI) / 180) * iconRadius + wheelSize / 2

            return (
              <div key={category.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Segment */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                  <path
                    d={`M${wheelSize / 2},${wheelSize / 2} L${wheelSize / 2 + (Math.cos((startAngle * Math.PI) / 180) * wheelSize) / 2},${wheelSize / 2 + (Math.sin((startAngle * Math.PI) / 180) * wheelSize) / 2} A${wheelSize / 2},${wheelSize / 2} 0 0,1 ${wheelSize / 2 + (Math.cos((endAngle * Math.PI) / 180) * wheelSize) / 2},${wheelSize / 2 + (Math.sin((endAngle * Math.PI) / 180) * wheelSize) / 2} Z`}
                    fill={isActive ? "rgba(0, 255, 157, 0.3)" : "rgba(0, 255, 157, 0.05)"}
                    stroke="rgba(0, 255, 157, 0.5)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Category Icon */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: iconX,
                    top: iconY,
                    transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                    color: isActive ? "#00ff9d" : "rgba(0, 255, 157, 0.7)",
                    fontSize: "20px",
                  }}
                >
                  {category.icon}
                </div>
              </div>
            )
          })}

          {/* Center Circle */}
          <div
            className="absolute rounded-full border-2 border-green-400/70 bg-black z-20 flex items-center justify-center pointer-events-none"
            style={{
              width: wheelSize * 0.3,
              height: wheelSize * 0.3,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg viewBox="0 0 24 24" width="36" height="36" className="text-green-400">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-green-400/50 text-xs mt-4 text-center">
          Click on the wheel to select a category
        </div>
      </div>
    </div>
  )
}

