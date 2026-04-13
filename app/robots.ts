import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/signup', '/forgot-password', '/reset-password'],
        disallow: [
          '/dashboard',
          '/contacts',
          '/opportunities',
          '/tasks',
          '/import',
          '/onboarding',
          '/welcome',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://cadenceos.app/sitemap.xml',
    host: 'https://cadenceos.app',
  }
}
