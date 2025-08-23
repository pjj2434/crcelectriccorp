import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { serviceImages } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { unstable_cache } from 'next/cache'
import { nanoid } from 'nanoid'

const SERVICE_CATEGORIES = {
  'landscape': 'LANDSCAPE & OUTDOOR LIGHTING',
  'pool': 'POOL & SAUNA ELECTRICAL', 
  'residential': 'RESIDENTIAL ELECTRICAL SERVICES',
  'commercial': 'COMMERCIAL ELECTRICAL SOLUTIONS',
  'ev': 'EV Charger Installation',
  'generator': 'Residential & Commercial Generator Installation'
}

const getCachedServiceImages = unstable_cache(
  async () => {
    console.log('🔄 Fetching fresh service images from database...')
    
    const allImages = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.isActive, 1))
      .orderBy(asc(serviceImages.serviceCategory), asc(serviceImages.createdAt))

    // Group by service category
    const imagesByCategory = allImages.reduce((acc, image) => {
      if (!acc[image.serviceCategory]) {
        acc[image.serviceCategory] = []
      }
      acc[image.serviceCategory].push(image)
      return acc
    }, {} as Record<string, typeof allImages>)

    console.log(`✅ Fresh service images cached: ${allImages.length} total images`)
    return { imagesByCategory, totalImages: allImages.length }
  },
  ['service-images'],
  {
    tags: ['service-images'],
    revalidate: 3600,
  }
)

// GET - Fetch service images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    console.log('📖 Getting service images (cached)...')
    const { imagesByCategory, totalImages } = await getCachedServiceImages()
    
    if (category) {
      return NextResponse.json({
        success: true,
        images: imagesByCategory[category] || [],
        category,
        count: imagesByCategory[category]?.length || 0,
        cached: true
      })
    }

    return NextResponse.json({
      success: true,
      imagesByCategory,
      totalImages,
      categories: SERVICE_CATEGORIES,
      cached: true
    })

  } catch (error) {
    console.error('Get service images error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch service images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Create new service image
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, url, fileKey, serviceCategory } = await request.json()

    if (!title || !url || !serviceCategory) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        required: ['title', 'url', 'serviceCategory']
      }, { status: 400 })
    }

    if (!SERVICE_CATEGORIES[serviceCategory as keyof typeof SERVICE_CATEGORIES]) {
      return NextResponse.json({ 
        error: 'Invalid service category',
        validCategories: Object.keys(SERVICE_CATEGORIES)
      }, { status: 400 })
    }

    console.log(`💾 Saving service image for ${serviceCategory}:`, { title, url })

    // Fixed insert operation - make sure all fields match the schema exactly
    const newImageData = {
      id: nanoid(),
      title: title,
      url: url,
      fileKey: fileKey || null,
      serviceCategory: serviceCategory,
      isActive: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      uploadedBy: session.user.id,
    }

    console.log('Inserting data:', newImageData)

    const [newImage] = await db
      .insert(serviceImages)
      .values(newImageData)
      .returning()

    // Revalidate cache
    console.log('🔄 Revalidating service images cache...')
    revalidateTag('service-images')

    console.log('✅ Service image saved and cache revalidated')

    return NextResponse.json({ 
      success: true, 
      image: newImage,
      message: 'Service image saved successfully'
    })

  } catch (error) {
    console.error('Save service image error:', error)
    return NextResponse.json({ 
      error: 'Failed to save service image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
