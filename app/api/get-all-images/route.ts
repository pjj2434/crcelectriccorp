import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { desc } from 'drizzle-orm'
import { unstable_cache, revalidateTag } from 'next/cache'
import { 
  customLightingInstallation,
  landscapeOutdoorLighting,
  poolSaunaElectrical,
  tvMountingWiring,
  electricalPanelsUpgrades,
  accentSpecialtyLighting
} from '@/db/schema'

// Cached function to get all images
const getCachedImages = unstable_cache(
  async () => {
    console.log('🔄 Fetching fresh data from database...')
    
    const [
      customLighting,
      landscapeOutdoor,
      poolSauna,
      tvMounting,
      electricalPanels,
      accentSpecialty
    ] = await Promise.all([
      db.select().from(customLightingInstallation).orderBy(desc(customLightingInstallation.createdAt)),
      db.select().from(landscapeOutdoorLighting).orderBy(desc(landscapeOutdoorLighting.createdAt)),
      db.select().from(poolSaunaElectrical).orderBy(desc(poolSaunaElectrical.createdAt)),
      db.select().from(tvMountingWiring).orderBy(desc(tvMountingWiring.createdAt)),
      db.select().from(electricalPanelsUpgrades).orderBy(desc(electricalPanelsUpgrades.createdAt)),
      db.select().from(accentSpecialtyLighting).orderBy(desc(accentSpecialtyLighting.createdAt))
    ])

    const result = {
      custom_lighting_installation: customLighting,
      landscape_outdoor_lighting: landscapeOutdoor,
      pool_sauna_electrical: poolSauna,
      tv_mounting_wiring: tvMounting,
      electrical_panels_upgrades: electricalPanels,
      accent_specialty_lighting: accentSpecialty
    }

    console.log('✅ Fresh data cached:', Object.entries(result).map(([key, images]) => `${key}: ${images.length}`))
    return result
  },
  ['all-images'], // Cache key
  {
    tags: ['images'], // Revalidation tag
    revalidate: 3600, // Fallback: revalidate every hour
  }
)

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📖 Getting images (cached)...')
    const imagesBySection = await getCachedImages()
    
    const totalImages = Object.values(imagesBySection).reduce(
      (sum, images) => sum + images.length, 
      0
    )

    return NextResponse.json({
      success: true,
      imagesBySection,
      totalImages,
      cached: true
    })

  } catch (error) {
    console.error('Get all images error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
