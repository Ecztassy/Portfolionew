"use client"

import { useRef, useState, useEffect, memo } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

export const ComputerModel = memo((props: any) => {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
  }, [hovered])

  return (
    <group
      ref={group}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>

      {/* Tower */}
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.8]} />
        <meshBasicMaterial color="#f0f0f0" />
      </mesh>

      {/* CRT Monitor */}
      <group position={[0.3, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.9, 0.1]} />
          <meshBasicMaterial color="#d0d0d0" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1, 0.75, 0.01]} />
          <meshBasicMaterial color={active ? "#00ff9d" : "#333"} />
        </mesh>
      </group>

      {/* Stand */}
      <mesh position={[0.3, -0.25, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshBasicMaterial color="#c0c0c0" />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0.3, -0.4, 0.4]}>
        <boxGeometry args={[1, 0.05, 0.3]} />
        <meshBasicMaterial color="#d0d0d0" />
      </mesh>
    </group>
  )
})
