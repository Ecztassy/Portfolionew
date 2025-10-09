import { useEffect, useRef, useState } from "react"

export function useFPS() {
  const [fps, setFps] = useState(60)
  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    let id: number

    const loop = () => {
      frames.current++
      const now = performance.now()
      if (now - lastTime.current >= 1000) {
        setFps(frames.current)
        frames.current = 0
        lastTime.current = now
      }
      id = requestAnimationFrame(loop)
    }

    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [])

  return fps
}
