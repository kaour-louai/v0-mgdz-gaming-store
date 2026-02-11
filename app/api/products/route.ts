import { NextRequest, NextResponse } from 'next/server'
import { getAllCards, createCard } from '@/lib/db'
import { GraphicsCard, ApiResponse } from '@/lib/types'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    const cards = await getAllCards()
    return NextResponse.json<ApiResponse<GraphicsCard[]>>({
      success: true,
      data: cards,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const card: Omit<GraphicsCard, 'createdAt' | 'updatedAt'> = {
      id: nanoid(),
      name: body.name,
      price: body.price,
      state: body.state || 'available',
      description: body.description,
      specs: body.specs,
      images: body.images || [],
    }

    const created = await createCard(card)

    return NextResponse.json<ApiResponse<GraphicsCard>>(
      {
        success: true,
        data: created,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 },
    )
  }
}
