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
      // Floating animation
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2

      // Spinning animation - adjust speed based on interaction
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
      {/* Add ambient light to make the model more visible */}
      <ambientLight intensity={0.8} />

      {/* Add point lights to illuminate the model */}
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00ff9d" />
      <pointLight position={[3, 0, 0]} intensity={1} color="#00ff9d" />
      <pointLight position={[-3, 0, 0]} intensity={1} color="#00ff9d" />
      <pointLight position={[0, 3, 0]} intensity={1} color="#ffffff" />

      {/* Main Floppy Body - Made thicker and more accurate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 3.5, 0.2]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Top label area */}
      <mesh position={[0, 1.2, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* Metal Slider */}
      <mesh position={[0, 0, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.8, 0.01]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Write Protection Notch */}
      <mesh position={[1.4, -1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Hub Ring - Center metal ring */}
      <mesh position={[0, 0, 0.11]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Hub Center */}
      <mesh position={[0, 0, 0.13]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Bottom label area with text */}
      <mesh position={[0, -1.2, 0.11]} castShadow receiveShadow>
        <planeGeometry args={[3.3, 0.8]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      

      {/* Corner notches */}
      <mesh position={[1.65, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[-1.65, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[1.65, -1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[-1.65, -1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Shutter */}
      <mesh position={[0, 1.4, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Glowing effect when hovered or clicked */}
      {(hovered || clicked) && (
        <mesh position={[0, 0, 0.11]} castShadow receiveShadow>
          <planeGeometry args={[3.5, 3.5]} />
          <meshStandardMaterial
            color="#00ff9d"
            emissive="#00ff9d"
            emissiveIntensity={clicked ? 0.5 : 0.2}
            transparent={true}
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  )
}

