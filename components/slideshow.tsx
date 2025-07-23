"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SlideshowProps {
  images: string[]
  autoplaySpeed?: number
}

export function Slideshow({ images, autoplaySpeed = 5000 }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle automatic slideshow
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [images.length, autoplaySpeed])

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  if (images.length === 0) {
    return <div className="w-full h-full bg-muted flex items-center justify-center">No images</div>
  }

  return (
    <div className="relative w-full h-full">
      {/* Current image */}
      <div className="relative h-full w-full">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Slide ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
      </div>

      {/* Navigation controls */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-4" : "bg-primary/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
