'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ProductCard } from './product-card'
import { ProductSearchFilter } from './product-search-filter'
import { GraphicsCard, ApiResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const ITEMS_PER_PAGE = 10

export function Storefront() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterState, setFilterState] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<GraphicsCard | null>(null)
  const [detailImageIndex, setDetailImageIndex] = useState(0)

  const { data, isLoading, error } = useSWR<ApiResponse<GraphicsCard[]>>(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  )

  const products = data?.data || []

  // Apply search and filters
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesState = filterState === 'all' || p.state === filterState
      return matchesSearch && matchesState
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return b.createdAt - a.createdAt
      }
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, filterState])

  const availableCount = products.filter((p) => p.state === 'available').length
  const outOfStockCount = products.filter((p) => p.state === 'out-of-stock')
    .length

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-2">Overview</h2>
        <p className="text-slate-300">
          Premium gaming and professional graphics cards
        </p>
        <div>
          <h3 className="text-3xl font-bold mb-2">استغفر الله - الحمد لله - الله اكبر</h3>
          <h3 className="text-3xl font-bold mb-2">لا اله الا الله</h3>
        </div>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-sm text-slate-400">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Available</p>
            <p className="text-2xl font-bold text-green-400">{availableCount}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Out of Stock</p>
            <p className="text-2xl font-bold text-red-400">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <ProductSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterState={filterState}
        onFilterStateChange={setFilterState}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load products. Please try again later.
        </div>
      )}

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No graphics cards available</p>
        </div>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No products match your filters</p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(p) => {
                  setSelectedProduct(p)
                  setDetailImageIndex(0)
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="gap-2"
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .animate-fade-in {
              animation: fadeIn 0.2s ease-out;
            }
            
            .animate-scale-in {
              animation: scaleIn 0.3s ease-out;
            }
          `}</style>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Images Section */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    <img
                      src={selectedProduct.images[detailImageIndex] || '/placeholder.svg'}
                      alt={`${selectedProduct.name} - Image ${detailImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDetailImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === detailImageIndex
                            ? 'border-slate-900'
                            : 'border-slate-200 hover:border-slate-400'
                            }`}
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Details Section */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Price</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {selectedProduct.price.toLocaleString()} DA
                    </p>
                  </div>
                  <Badge className={`
                    ${selectedProduct.state === 'available' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedProduct.state === 'out-of-stock' ? 'bg-red-100 text-red-800' : ''}
                    ${selectedProduct.state === 'discontinued' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {selectedProduct.state === 'available'
                      ? 'In Stock'
                      : selectedProduct.state === 'out-of-stock'
                        ? 'Out of Stock'
                        : 'Discontinued'}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-slate-600 mb-2">Description</p>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
