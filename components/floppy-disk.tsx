"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

export function FloppyDisk(props: any) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
      const rotationSpeed = clicked ? 0.05 : hovered ? 0.01 : 0.003
      group.current.rotation.y += rotationSpeed
    }
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
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 3]} intensity={2} color="#00ff9d" />
      <pointLight position={[3, 0, 0]} intensity={1.5} color="#00ff9d" />
      <pointLight position={[-3, 0, 0]} intensity={1.5} color="#00ff9d" />
      <pointLight position={[0, 3, -3]} intensity={1} color="#ffffff" /> {/* backlight for separation */}

      {/* Main Floppy Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 3.5, 0.2]} />
        <meshStandardMaterial color="#444444" roughness={0.7} />
      </mesh>

      {/* Top label area */}
      <mesh position={[0, 1.2, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshStandardMaterial color="#555555" roughness={0.6} />
      </mesh>

      {/* Metal Slider */}
      <mesh position={[0, 0, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hub Ring */}
      <mesh position={[0, 0, 0.11]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Glowing effect when hovered or clicked */}
      {(hovered || clicked) && (
        <mesh position={[0, 0, 0.11]} castShadow receiveShadow>
          <planeGeometry args={[3.5, 3.5]} />
          <meshStandardMaterial
            color="#00ff9d"
            emissive="#00ff9d"
            emissiveIntensity={clicked ? 0.5 : 0.2}
            transparent
            opacity={0.05} // slightly more visible
          />
        </mesh>
      )}
    </group>
  )
}
