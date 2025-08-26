"use client"

import { useState } from "react"
import Image from "next/image"

export default function MagnifierImage({ src, alt, className }) {
  const [transformOrigin, setTransformOrigin] = useState("center")
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    setTransformOrigin(`${(x / width) * 100}% ${(y / height) * 100}%`)
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovering(false)
        setTransformOrigin("center")
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: "cover",
          transition: "transform 0.3s ease",
          transform: isHovering ? "scale(3)" : "scale(1)",
          transformOrigin: transformOrigin,
        }}
      />
    </div>
  )
}