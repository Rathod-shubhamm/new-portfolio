"use client"

import { useEffect, useState } from "react"
import Lenis from "@studio-freight/lenis"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const moveFollower = () => {
      setFollowerPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }))
      requestAnimationFrame(moveFollower)
    }

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button']")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)
    const followerRaf = requestAnimationFrame(moveFollower)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
      cancelAnimationFrame(followerRaf)
    }
  }, [position.x, position.y])

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
        }}
      />
      <div
        className="custom-cursor-follower"
        style={{
          transform: `translate3d(${followerPosition.x - 16}px, ${followerPosition.y - 16}px, 0)`,
          width: isHovering ? "64px" : "32px",
          height: isHovering ? "64px" : "32px",
          backgroundColor: isHovering ? "rgba(99, 102, 241, 0.1)" : "transparent",
          borderColor: isHovering ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.3)",
        }}
      />
    </>
  )
}
