"use client"

import Image from "next/image"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

export default function MagnifierImage({ src, alt, className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Zoom>
        <div className="relative w-full aspect-square">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover cursor-zoom-in"
            priority
          />
        </div>
      </Zoom>
      
      {/* Mobile hint */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded md:hidden pointer-events-none z-10">
        Tap to zoom
      </div>
    </div>
  )
}
