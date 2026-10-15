
import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'


export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

    if(!sessionCookie && request.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}


export const config = {
  matcher: ['/profile/:path*'],
}