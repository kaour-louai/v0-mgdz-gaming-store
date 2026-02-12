'use client'

import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { GraphicsCard, ApiResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { ProductForm } from './product-form'
import { ProductSearchFilter } from './product-search-filter'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const ITEMS_PER_PAGE = 10

export function AdminDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<GraphicsCard | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterState, setFilterState] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useSWR<ApiResponse<GraphicsCard[]>>(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mutate('/api/products')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product: GraphicsCard) => {
    setEditingProduct(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    setEditingProduct(null)
  }

  const stateColors = {
    available: 'bg-green-100 text-green-800',
    'out-of-stock': 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your graphics card inventory
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setEditingId(null)
            setShowForm(true)
          }}
          className="gap-2 bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      <ProductSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterState={filterState}
        onFilterStateChange={setFilterState}
      />

      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={handleFormClose}
          onSuccess={() => {
            mutate('/api/products')
            handleFormClose()
          }}
        />
      )}

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

      {products.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-slate-600 text-lg mb-4">No products yet</p>
            <Button
              onClick={() => {
                setEditingProduct(null)
                setEditingId(null)
                setShowForm(true)
              }}
              className="gap-2 bg-slate-900 hover:bg-slate-800"
            >
              <Plus size={20} />
              Create First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-slate-600 text-lg">No products match your filters</p>
              </CardContent>
            </Card>
          )}
          {filteredProducts.length > 0 && (
            <>
              <p className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left p-3 font-semibold text-slate-900">
                        Name
                      </th>
                      <th className="text-left p-3 font-semibold text-slate-900">
                        Price
                      </th>
                      <th className="text-left p-3 font-semibold text-slate-900">
                        State
                      </th>
                      <th className="text-left p-3 font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 text-slate-900 font-medium">
                    {product.name}
                  </td>
                  <td className="p-3 text-slate-700">
                    {product.price.toLocaleString()} DA
                  </td>
                  <td className="p-3">
                    <Badge className={stateColors[product.state]}>
                      {product.state === 'available'
                        ? 'In Stock'
                        : product.state === 'out-of-stock'
                          ? 'Out of Stock'
                          : 'Discontinued'}
                    </Badge>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="gap-1"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700 gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </td>
                </tr>
                    ))}
                  </tbody>
                </table>
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
            </>
          )}
        </div>
      )}
    </div>
  )
}
