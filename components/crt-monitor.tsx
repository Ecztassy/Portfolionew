"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import * as THREE from "three"

export function CRTMonitor(props: any) {
  const group = useRef<Group>(null)
  const [isOn, setIsOn] = useState(false)
  const [bootSequence, setBootSequence] = useState(0)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  // Floating animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  // Handle auto turn-on and boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOn(true)
      const bootTimer = setInterval(() => {
        setBootSequence((prev) => {
          if (prev >= 3) {
            clearInterval(bootTimer)
            return prev
          }
          return prev + 1
        })
      }, 800)
      return () => clearInterval(bootTimer)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Update texture based on state
  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 160 // Pixel width
    canvas.height = 120 // Pixel height (matches 1.6:1.2 aspect ratio)
    const context = canvas.getContext("2d")

    if (!context) return

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw content based on isOn and bootSequence
    if (!isOn) {
      context.fillStyle = "black"
      context.fillRect(0, 0, canvas.width, canvas.height)
    } else if (bootSequence === 0) {
      context.fillStyle = "black"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = "#00ff9d"
      context.font = "12px monospace"
      context.fillText("Initializing...", 10, 20)
    } else if (bootSequence === 1) {
      context.fillStyle = "black"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = "#00ff9d"
      context.font = "10px monospace"
      context.fillText("WIRED CONNECTION", 10, 20)
      context.fillText("> Loading system...", 10, 40)
      context.fillText("> Checking protocols...", 10, 60)
    } else if (bootSequence === 2) {
      context.fillStyle = "black"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = "#00ff9d"
      context.font = "10px monospace"
      context.fillText("SYSTEM READY", 10, 20)
      context.fillText("> Welcome to the Wired", 10, 40)
      context.fillText("> All connections active", 10, 60)
    } else if (bootSequence >= 3) {
      // Pre-fill with black in case image fails to load
      context.fillStyle = "black"
      context.fillRect(0, 0, canvas.width, canvas.height)

      const img = new Image()
      img.crossOrigin = "anonymous"
      // Add cache-busting parameter to force reload
      img.src = "/images/lain.gif?v=" + new Date().getTime()

      // Set a timeout to handle slow loading
      const loadTimeout = setTimeout(() => {
        if (!img.complete) {
          // Image is taking too long, show fallback
          context.fillStyle = "#00ff9d"
          context.font = "10px monospace"
          context.fillText("IMAGE LOADING...", 10, 20)
          context.fillText("> Please wait", 10, 40)
          if (textureRef.current) {
            textureRef.current.needsUpdate = true
          }
        }
      }, 1000)

      img.onload = () => {
        clearTimeout(loadTimeout)
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        if (textureRef.current) {
          textureRef.current.needsUpdate = true
        }
      }

      img.onerror = (e) => {
        clearTimeout(loadTimeout)
        console.error("Error loading image:", e)
        // Fallback content if image fails to load
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = "#00ff9d"
        context.font = "10px monospace"
        context.fillText("IMAGE ERROR", 10, 20)
        context.fillText("> Connection lost", 10, 40)
        if (textureRef.current) {
          textureRef.current.needsUpdate = true
        }
      }
    }

    // Create or update texture
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvas)
    } else {
      textureRef.current.image = canvas
      textureRef.current.needsUpdate = true
    }
  }, [bootSequence, isOn])

  return (
    <group ref={group} {...props}>
      {/* Monitor Base */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.6]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Monitor Frame */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.4, 0.2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.2, 0.11]} castShadow receiveShadow onClick={() => setIsOn(!isOn)}>
        <planeGeometry args={[1.6, 1.2]} /> {/* Use planeGeometry for texture */}
        <meshStandardMaterial
          map={textureRef.current} // Apply the texture
          color={isOn ? "#222222" : "#111111"}
          emissive={isOn ? "#00ff9d" : "#000000"}
          emissiveIntensity={isOn ? 1 : 0} // Fixed emissiveIntensity
        />
      </mesh>

      {/* Monitor Controls */}
      <mesh position={[0, -0.5, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.05]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Power Button */}
      <mesh position={[0.25, -0.5, 0.18]} castShadow receiveShadow onClick={() => setIsOn(!isOn)}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color={isOn ? "#00ff9d" : "#444444"} />
      </mesh>
    </group>
  )
}

