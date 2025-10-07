"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { parseGIF, decompressFrames } from "gifuct-js"

export function DesktopScene(props: any) {
  const group = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const framesRef = useRef<any[]>([])
  const frameIndexRef = useRef(0)
  const lastFrameTimeRef = useRef(0)

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  // Preload GIF immediately
  useEffect(() => {
    let mounted = true

    const loadGif = async () => {
      try {
        const res = await fetch("/images/lain.gif")
        const buffer = await res.arrayBuffer()
        const gif = parseGIF(buffer)
        const frames = decompressFrames(gif, true)
        if (!mounted) return

        framesRef.current = frames

        // Canvas and texture
        const canvas = document.createElement("canvas")
        canvas.width = frames[0].dims.width
        canvas.height = frames[0].dims.height
        const ctx = canvas.getContext("2d")!

        // Draw first frame immediately
        const firstFrame = frames[0]
        const imageData = new ImageData(
          new Uint8ClampedArray(firstFrame.patch),
          firstFrame.dims.width,
          firstFrame.dims.height
        )
        ctx.putImageData(imageData, firstFrame.dims.left, firstFrame.dims.top)

        const tex = new THREE.CanvasTexture(canvas)
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.format = THREE.RGBAFormat

        canvasRef.current = canvas
        setTexture(tex)
      } catch (err) {
        console.error("Failed to load GIF:", err)
        const fallback = createFallbackTexture()
        setTexture(fallback)
      }
    }

    loadGif()
    return () => {
      mounted = false
      texture?.dispose()
    }
  }, [])

  // Animate GIF frames and desktop group
  useFrame(({ clock }) => {
    if (texture && framesRef.current.length > 0 && canvasRef.current) {
      const currentTime = clock.getElapsedTime() * 700
      const frames = framesRef.current
      const currentFrame = frames[frameIndexRef.current]

      if (currentFrame && currentTime - lastFrameTimeRef.current >= currentFrame.delay) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          const imageData = new ImageData(
            new Uint8ClampedArray(currentFrame.patch),
            currentFrame.dims.width,
            currentFrame.dims.height
          )
          ctx.putImageData(imageData, currentFrame.dims.left, currentFrame.dims.top)
          texture.needsUpdate = true
        }
        frameIndexRef.current = (frameIndexRef.current + 1) % frames.length
        lastFrameTimeRef.current = currentTime
      }
    }

    if (group.current) {
      group.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  // Fallback texture for error cases
  const createFallbackTexture = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = "#00ff9d"
    ctx.font = "20px monospace"
    ctx.textAlign = "center"
    ctx.fillText("SIGNAL LOST", 128, 128)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }

  return (
    <group ref={group} {...props} scale={[1.2, 1.2, 1.2]} position={[0, -0.5, 0]}>
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <pointLight position={[-2, 2, 3]} intensity={3.5} color="#00ff9d" />
      <pointLight position={[2, -1, 3]} intensity={3} color="#00ff9d" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[0, -1, 2]} intensity={3} color="#00ff9d" />
      <spotLight position={[0, 2, 3]} intensity={2.5} angle={0.5} penumbra={1} castShadow />
      <spotLight position={[0, 0.5, 3]} intensity={4} angle={0.3} penumbra={0.5} distance={10} color="#ffffff" castShadow />

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

      {/* Screen with GIF */}
      <mesh ref={screenRef} position={[0, 0.5, 1.03]} castShadow receiveShadow>
        <planeGeometry args={[2.4, 1.7]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#000000" emissive="#00ff9d" emissiveIntensity={0.3} />
        )}
      </mesh>

      {/* Glowing overlay */}
      <mesh position={[0, 0.5, 1.035]} castShadow receiveShadow>
        <planeGeometry args={[2.4, 1.7]} />
        <meshStandardMaterial color="#000000" emissive="#00ff9d" emissiveIntensity={0.4} transparent opacity={0.3} />
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
      <group position={[1.4, -0.95, 1.5]}>
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
