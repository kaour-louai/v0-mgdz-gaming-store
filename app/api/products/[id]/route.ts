import { NextRequest, NextResponse } from 'next/server'
import { getCardById, updateCard, deleteCard } from '@/lib/db'
import { GraphicsCard, ApiResponse } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const card = await getCardById(id)

    if (!card) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<GraphicsCard>>({
      success: true,
      data: card,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch product',
      },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updated = await updateCard(id, body)

    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<GraphicsCard>>({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to update product',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await deleteCard(id)

    return NextResponse.json<ApiResponse<null>>({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to delete product',
      },
      { status: 500 },
    )
  }
}
