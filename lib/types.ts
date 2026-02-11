export interface GraphicsCard {
  id: string
  name: string
  price: number
  state: 'available' | 'out-of-stock' | 'discontinued'
  description: string
  specs: Record<string, never>
  images: string[]
  createdAt: number
  updatedAt: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
