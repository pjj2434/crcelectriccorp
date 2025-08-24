import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/login/', '/signup/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml', // Replace with your actual domain
  }
} 