import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Routes that are always public (no auth required)
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth')

  // Routes authenticated users can access that aren't the main app
  const isOnboardingRoute =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/welcome')

  if (!user && !isPublicRoute && !isOnboardingRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
