"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"


export function ComputerModel(props: any) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [showProjects, setShowProjects] = useState(false)

  // Create a simple computer model since we don't have a specific model file
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
    }
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
      onClick={() => {
        setActive(!active)
        setShowProjects(!showProjects)
      }}
    >
      {/* Computer Base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Computer Tower */}
      <mesh position={[-0.8, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1, 0.8]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* CRT Monitor */}
      <group position={[0.3, 0.3, 0]}>
        {/* Monitor Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.06]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.75, 0.01]} />
          <meshStandardMaterial
            color={active ? "#00ff9d" : "#333333"}
            emissive={active ? "#00ff9d" : "#000000"}
            emissiveIntensity={active ? 0.5 : 0}
          />
        </mesh>
        </group>

    

      {/* Monitor Stand */}
      <mesh position={[0.3, -0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0.3, -0.4, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.05, 0.3]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
    </group>
  )
}

