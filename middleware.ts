import { createClient } from '@/utils/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  // Refresh the session — keeps the cookie alive on every request.
  // IMPORTANT: must await getUser() (not getSession()) so the JWT is
  // validated server-side, not just read from the cookie.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that never need a session
  const publicPaths = ['/login', '/signup', '/auth/callback', '/auth/confirm']
  const isPublic = publicPaths.some(p => pathname.startsWith(p))

  // Unauthenticated user hitting a protected route → send to login
  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user hitting login/signup → send to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - _next/static  (Next.js build assets)
     * - _next/image   (image optimisation)
     * - favicon.ico, logo.png, and other static files
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
