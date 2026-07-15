import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // TODO: Add role checking logic for /admin/*
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
