"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function MagnifierImage({ src, alt, className }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState("center")
  const containerRef = useRef(null)
  
  // Mobile state
  const [lastTouchDistance, setLastTouchDistance] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return // Skip for mobile
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    setTransformOrigin(`${(x / width) * 100}% ${(y / height) * 100}%`)
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setLastTouchDistance(distance)
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging && scale > 1) {
      const deltaX = e.touches[0].clientX - lastTouchPos.x
      const deltaY = e.touches[0].clientY - lastTouchPos.y
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      if (lastTouchDistance) {
        const delta = distance - lastTouchDistance
        const newScale = Math.min(Math.max(scale + delta * 0.01, 1), 5)
        setScale(newScale)
        if (newScale === 1) setPosition({ x: 0, y: 0 })
      }
      setLastTouchDistance(distance)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setLastTouchDistance(null)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovering(false)
        setTransformOrigin("center")
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transition: isHovering ? "none" : "transform 0.2s ease-out",
          transformOrigin: transformOrigin,
          transform: isHovering 
            ? "scale(2.5)" 
            : `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: "cover",
          }}
          priority
        />
      </div>
      
      {/* Mobile hint */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded md:hidden pointer-events-none">
        Pinch to zoom, drag to pan
      </div>
    </div>
  )
}