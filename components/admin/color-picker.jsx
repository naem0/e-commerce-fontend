"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ColorPicker({ color, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef(null)
  const [selectedColor, setSelectedColor] = useState(color)

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create color gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "rgb(255, 0, 0)")
    gradient.addColorStop(1 / 6, "rgb(255, 255, 0)")
    gradient.addColorStop(2 / 6, "rgb(0, 255, 0)")
    gradient.addColorStop(3 / 6, "rgb(0, 255, 255)")
    gradient.addColorStop(4 / 6, "rgb(0, 0, 255)")
    gradient.addColorStop(5 / 6, "rgb(255, 0, 255)")
    gradient.addColorStop(1, "rgb(255, 0, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add white to black gradient overlay
    const gradientB = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradientB.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradientB.addColorStop(0.5, "rgba(255, 255, 255, 0)")
    gradientB.addColorStop(0.5, "rgba(0, 0, 0, 0)")
    gradientB.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = gradientB
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [isOpen])

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const imageData = ctx.getImageData(x, y, 1, 1).data
    const color = `#${imageData[0].toString(16).padStart(2, "0")}${imageData[1]
      .toString(16)
      .padStart(2, "0")}${imageData[2].toString(16).padStart(2, "0")}`

    setSelectedColor(color)
    onChange(color)
  }

  const handleApply = () => {
    onChange(selectedColor)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0" style={{ backgroundColor: color }}>
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              onClick={handleCanvasClick}
              className="w-full h-48 cursor-crosshair rounded-md"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: selectedColor }} />
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
