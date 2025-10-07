"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Texture, CanvasTexture } from "three"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"

export function CRTMonitor() {
  const meshRef = useRef<THREE.Mesh>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const framesRef = useRef<any[]>([])
  const frameIndexRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const { parseGIF, decompressFrames } = await import("gifuct-js")

        // fetch and decode the GIF
        const res = await fetch("/images/lain.gif", { cache: "reload" })
        const buffer = await res.arrayBuffer()
        const gif = parseGIF(buffer)
        const frames = decompressFrames(gif, true)

        if (!mounted) return

        framesRef.current = frames

        // make a canvas-based texture for updating
        const canvas = document.createElement("canvas")
        canvas.width = frames[0].dims.width
        canvas.height = frames[0].dims.height
        const ctx = canvas.getContext("2d")!
        textureRef.current = new THREE.CanvasTexture(canvas)
        textureRef.current.minFilter = THREE.LinearFilter
        textureRef.current.magFilter = THREE.LinearFilter
        textureRef.current.needsUpdate = true

        setReady(true)

        // draw the first frame
        const imageData = ctx.createImageData(
          frames[0].dims.width,
          frames[0].dims.height
        )
        imageData.data.set(frames[0].patch)
        ctx.putImageData(imageData, 0, 0)
        textureRef.current.needsUpdate = true
      } catch (err) {
        console.error("Failed to load GIF:", err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  useFrame((_, delta) => {
    if (!ready || !textureRef.current || framesRef.current.length === 0) return

    const frames = framesRef.current
    const canvas = textureRef.current.image as HTMLCanvasElement
    const ctx = canvas.getContext("2d")!

    // advance frame timing based on delays
    frameIndexRef.current =
      (frameIndexRef.current + 1) % frames.length

    const frame = frames[frameIndexRef.current]
    const imageData = ctx.createImageData(
      frame.dims.width,
      frame.dims.height
    )
    imageData.data.set(frame.patch)
    ctx.putImageData(imageData, 0, 0)
    textureRef.current.needsUpdate = true
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 1.5]} />
      <meshBasicMaterial
        attach="material"
        map={textureRef.current as Texture}
        toneMapped={false}
      />
    </mesh>
  )
}
