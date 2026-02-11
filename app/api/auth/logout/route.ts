import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  
  // Clear the session cookie
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    maxAge: 0,
  })

  return response
}
