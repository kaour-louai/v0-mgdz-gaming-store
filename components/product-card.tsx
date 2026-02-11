'use client'

import { useState } from 'react'
import { GraphicsCard } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ImagePreviewModal } from './image-preview-modal'

interface ProductCardProps {
  product: GraphicsCard
}

interface ProductCardWithDetailProps extends ProductCardProps {
  onProductClick?: (product: GraphicsCard) => void
}

export function ProductCard({ product, onProductClick }: ProductCardWithDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const stateColors = {
    available: 'bg-green-100 text-green-800',
    'out-of-stock': 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800',
  }

  const currentImage = product.images?.[currentImageIndex]
  const hasMultipleImages = (product.images?.length || 0) > 1

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 h-48 flex items-center justify-center group cursor-pointer">
          {currentImage ? (
            <img
              src={currentImage || "/placeholder.svg"}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover hover:brightness-75 transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="text-slate-400 text-center px-4">
              <div className="text-4xl mb-2">📷</div>
              <p>No Images</p>
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images?.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <ImagePreviewModal
          isOpen={isModalOpen}
          images={product.images || []}
          initialIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
        />

        <div 
          className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => onProductClick?.(product)}
        >
          <h3 className="font-bold text-lg text-slate-900 truncate">
            {product.name}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {product.price.toLocaleString()} DA
              </div>
            </div>
            <Badge className={stateColors[product.state]}>
              {product.state === 'available'
                ? 'In Stock'
                : product.state === 'out-of-stock'
                  ? 'Out of Stock'
                  : 'Discontinued'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
