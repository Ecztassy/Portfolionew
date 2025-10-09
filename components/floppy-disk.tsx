"use client"

import React, { useRef, useState, memo } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import { useFPS } from "./useFPS"

export const FloppyDisk = memo((props: any) => {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const fps = useFPS()

  useFrame((state, delta) => {
    if (!group.current) return

    // Adjust rotation speed based on FPS
    const baseSpeed = clicked ? 0.05 : hovered ? 0.01 : 0.003
    const speedFactor = Math.min(fps / 60, 1) // reduce speed if FPS < 60
    group.current.rotation.y += baseSpeed * speedFactor

    // Bounce animation
    group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2 * speedFactor
  })

  return (
    <group
      ref={group}
      {...props}
      rotation={[0, 0, 0]}
      position={[0, 0, -1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={1} />

      <mesh>
        <boxGeometry args={[3.5, 3.5, 0.2]} />
        <meshBasicMaterial color="#444" />
      </mesh>

      <mesh position={[0, 1.2, 0.11]}>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshBasicMaterial color="#555" />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshBasicMaterial color="#666" />
      </mesh>

      <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 16]} />
        <meshBasicMaterial color="#888" />
      </mesh>

      {(hovered || clicked) && (
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[3.5, 3.5]} />
          <meshBasicMaterial color="#00ff9d" transparent opacity={0.05} />
        </mesh>
      )}
    </group>
  )
})
