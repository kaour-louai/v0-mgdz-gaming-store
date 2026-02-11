'use client'

import React from "react"

import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ImagePreviewModalProps {
  isOpen: boolean
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function ImagePreviewModal({
  isOpen,
  images,
  initialIndex,
  onClose,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  if (!isOpen) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>

        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Preview ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-12 rounded border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-white scale-110'
                    : 'border-white/30 hover:border-white/50 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
