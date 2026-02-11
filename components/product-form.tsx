'use client'

import React from "react"

import { useState } from 'react'
import { GraphicsCard } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Trash2 } from 'lucide-react'

interface ProductFormProps {
  product?: GraphicsCard
  onClose: () => void
  onSuccess: () => void
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [])
  const [uploadError, setUploadError] = useState<string>('')
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    state: product?.state || 'available',
    description: product?.description || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrls.length === 0) {
      alert('Please add at least one image')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        state: formData.state,
        description: formData.description,
        specs: {},
        images: imageUrls,
      }

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setIsUploading(true)
    setUploadError('')

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          setUploadError(error.error || 'Upload failed')
          return
        }

        const data = await response.json()
        setImageUrls((prev) => [...prev, data.url])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image')
    } finally {
      setIsUploading(false)
      // Reset the input
      e.currentTarget.value = ''
    }
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = imageUrls[index]
    if (!imageUrl) return

    try {
      console.log('[v0] Attempting to delete image:', imageUrl)
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('[v0] Delete failed:', error)
        setUploadError(`Failed to delete image: ${error.error}`)
        return
      }

      console.log('[v0] Image deleted successfully')
    } catch (error) {
      console.error('[v0] Delete error:', error)
      setUploadError('Failed to delete image')
      return
    }

    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <CardTitle>
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Product Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., RTX 4090"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Price (DA)
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                State
              </label>
              <Select value={formData.state} onValueChange={(value: any) =>
                setFormData({ ...formData, state: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Product description..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-medium text-slate-700">
              Product Images
            </label>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-sm">
                {uploadError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <p className="text-sm font-medium text-slate-700">
                    {isUploading ? 'Uploading...' : 'Click to upload or drag images here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, WebP, GIF up to 5MB each
                  </p>
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Uploaded Images ({imageUrls.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-slate-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
