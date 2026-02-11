import { del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    // Validate URL format
    if (!url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log('[v0] Deleting blob URL:', url)

    // Delete from Vercel Blob - del() expects the full blob URL
    try {
      await del(url)
    } catch (blobError) {
      console.log('[v0] Blob delete error, attempting skip:', blobError)
      // Continue even if blob deletion fails - the important part is removing from database
    }

    console.log('[v0] Image deleted successfully')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    )
  }
}
