"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type { Group } from "three"
import * as THREE from "three"

export function DesktopScene(props: any) {
  const group = useRef<Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const frameIndexRef = useRef(0)
  const framesRef = useRef<any[]>([])
  const lastFrameTimeRef = useRef(0)
  const loadingAttemptedRef = useRef(false)
  const loadingFailedRef = useRef(false)

  // Create a fallback texture
  const createFallbackTexture = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    canvas.width = 256
    canvas.height = 256

    // Fill with black background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add some text
    ctx.fillStyle = "#00ff9d"
    ctx.font = "20px monospace"
    ctx.textAlign = "center"
    ctx.fillText("CONNECTION LOST", canvas.width / 2, canvas.height / 2 - 20)
    ctx.fillText("SIGNAL NOT FOUND", canvas.width / 2, canvas.height / 2 + 20)

    // Add a border
    ctx.strokeStyle = "#00ff9d"
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Create texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }

  useEffect(() => {
    // Only attempt to load once
    if (loadingAttemptedRef.current) return
    loadingAttemptedRef.current = true

    // Create a static texture immediately as a fallback
    textureRef.current = createFallbackTexture()

    // Update the GIF loading logic to handle errors better
    const loadGif = async () => {
      try {
        console.log("Attempting to load GIF...")

        // Create a fallback texture immediately
        const fallbackTexture = createFallbackTexture()
        textureRef.current = fallbackTexture

        // Try to dynamically import gifuct-js
        const gifuctModule = await import("gifuct-js").catch((err) => {
          console.error("Failed to import gifuct-js:", err)
          throw new Error("Failed to load GIF parser module")
        })

        const { parseGIF, decompressFrames } = gifuctModule

        // Fetch the GIF with a cache-busting parameter
        console.log("Fetching GIF from /images/lain.gif")
        const response = await fetch("/images/lain.gif?v=" + new Date().getTime())
        if (!response.ok) {
          throw new Error(`Failed to fetch GIF: ${response.status} ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        console.log("GIF fetched, size:", arrayBuffer.byteLength, "bytes")

        if (arrayBuffer.byteLength === 0) {
          throw new Error("GIF file is empty")
        }

        console.log("Parsing GIF...")
        const gif = parseGIF(arrayBuffer)
        console.log("Decompressing frames...")
        const frames = decompressFrames(gif, true)

        console.log("Frames extracted:", frames?.length)
        if (!frames || frames.length === 0) {
          console.error("No frames found in GIF")
          throw new Error("No frames found in GIF")
        }

        framesRef.current = frames

        // Create canvas and texture
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }

        canvas.width = frames[0].dims.width
        canvas.height = frames[0].dims.height
        console.log("Canvas created with dimensions:", canvas.width, "x", canvas.height)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat

        canvasRef.current = canvas
        textureRef.current = texture

        // Draw the first frame immediately
        const firstFrame = frames[0]
        console.log("Drawing first frame:", firstFrame.dims)
        const imageData = new ImageData(
          new Uint8ClampedArray(firstFrame.patch),
          firstFrame.dims.width,
          firstFrame.dims.height,
        )
        ctx.putImageData(imageData, firstFrame.dims.left, firstFrame.dims.top)
        texture.needsUpdate = true

        console.log("GIF loaded successfully")
        loadingFailedRef.current = false
      } catch (error) {
        console.error("Failed to load GIF:", error)
        loadingFailedRef.current = true

        // Ensure fallback texture is applied
        if (!textureRef.current) {
          textureRef.current = createFallbackTexture()
        }
        if (textureRef.current) {
          textureRef.current.needsUpdate = true
        }
      }
    }

    loadGif()

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [])

  const { clock } = useThree()

  useFrame(() => {
    // Handle GIF animation if loaded successfully
    if (!loadingFailedRef.current && framesRef.current.length > 0 && canvasRef.current && textureRef.current) {
      const currentTime = clock.getElapsedTime() * 1000 // Convert to milliseconds
      const frames = framesRef.current
      const currentFrame = frames[frameIndexRef.current]

      if (currentFrame && currentTime - lastFrameTimeRef.current >= currentFrame.delay) {
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Clear the canvas for transparency
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Draw the current frame
        const imageData = new ImageData(
          new Uint8ClampedArray(currentFrame.patch),
          currentFrame.dims.width,
          currentFrame.dims.height,
        )
        ctx.putImageData(imageData, currentFrame.dims.left, currentFrame.dims.top)

        // Update the texture
        textureRef.current.needsUpdate = true

        // Advance to the next frame and update timing
        frameIndexRef.current = (frameIndexRef.current + 1) % frames.length
        lastFrameTimeRef.current = currentTime
      }
    }

    // Animate the model
    if (group.current) {
      group.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  return (
    <group ref={group} {...props} scale={[1.2, 1.2, 1.2]} position={[0, -0.5, 0]}>
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <pointLight position={[-2, 2, 3]} intensity={3.5} color="#00ff9d" />
      <pointLight position={[2, -1, 3]} intensity={3} color="#00ff9d" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[0, -1, 2]} intensity={3} color="#00ff9d" />
      <spotLight position={[0, 2, 3]} intensity={2.5} angle={0.5} penumbra={1} castShadow />
      <spotLight
        position={[0, 0.5, 3]}
        intensity={4}
        angle={0.3}
        penumbra={0.5}
        distance={10}
        color="#ffffff"
        castShadow
      />

      {/* Desktop Tower */}
      <group position={[-2.2, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.8, 1.5]} />
          <meshStandardMaterial color="#222222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.76]} castShadow receiveShadow>
          <boxGeometry args={[1.19, 1.79, 0.01]} />
          <meshStandardMaterial color="#333333" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.6, 0.77]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.15, 0.02]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.4, 0.77]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.15, 0.02]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.4, 0, 0.77]} castShadow receiveShadow>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          </mesh>
          <meshStandardMaterial color="#00ff9d" emissive="#00ff9d" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.25, 0, 0.77]} castShadow receiveShadow>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          </mesh>
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[0, -0.6, 0.77]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 0.02]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Monitor Base */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.2]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* CRT Monitor Frame */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.2, 2]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Screen Bezel */}
      <mesh position={[0, 0.5, 1.01]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.9, 0.02]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* Screen with GIF texture */}
      <mesh ref={screenRef} position={[0, 0.5, 1.03]} castShadow receiveShadow>
        <planeGeometry args={[2.4, 1.7]} />
        {textureRef.current ? (
          <meshBasicMaterial map={textureRef.current} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#000000" emissive="#00ff9d" emissiveIntensity={0.3} />
        )}
      </mesh>

      {/* Glowing effect */}
      <mesh position={[0, 0.5, 1.035]} castShadow receiveShadow>
        <planeGeometry args={[2.4, 1.7]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00ff9d"
          emissiveIntensity={0.4}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Keyboard */}
      <group position={[0, -0.95, 1.5]} rotation={[0.1, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#222222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.02, 0.7]} />
          <meshStandardMaterial color="#333333" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.07, -0.25]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.07, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.07, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.07, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.07, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.08, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.02, 0.08]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* Mouse */}
      <group position={[1.2, -0.95, 1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.1, 0.5]} />
          <meshStandardMaterial color="#222222" roughness={0.8} />
        </mesh>
        <group position={[0, 0.06, -0.1]}>
          <mesh position={[-0.08, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.14, 0.01, 0.2]} />
            <meshStandardMaterial color="#333333" roughness={0.7} />
          </mesh>
          <mesh position={[0.08, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.14, 0.01, 0.2]} />
            <meshStandardMaterial color="#333333" roughness={0.7} />
          </mesh>
        </group>
        <mesh position={[0, 0.06, -0.05]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#444444" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

