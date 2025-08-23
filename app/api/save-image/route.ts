import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { revalidateTag } from 'next/cache'
import { 
  customLightingInstallation,
  landscapeOutdoorLighting,
  poolSaunaElectrical,
  tvMountingWiring,
  electricalPanelsUpgrades,
  accentSpecialtyLighting
} from '@/db/schema'
import { randomUUID } from 'crypto'

const sectionTables = {
  'custom_lighting_installation': customLightingInstallation,
  'landscape_outdoor_lighting': landscapeOutdoorLighting,
  'pool_sauna_electrical': poolSaunaElectrical,
  'tv_mounting_wiring': tvMountingWiring,
  'electrical_panels_upgrades': electricalPanelsUpgrades,
  'accent_specialty_lighting': accentSpecialtyLighting,
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, url, fileKey, section } = await request.json()

    if (!title || !url || !section) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const table = sectionTables[section as keyof typeof sectionTables]
    if (!table) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    console.log(`💾 Saving image to ${section}:`, { title, url })

   const [newImage] = await db.insert(table).values({
  id: randomUUID(),
  title,
  url,
  fileKey: fileKey || null,
  uploadedBy: session.user.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}).returning()

    // 🔥 Revalidate cache after successful insert
    console.log('🔄 Revalidating images cache...')
    revalidateTag('images')

    console.log('✅ Image saved and cache revalidated')

    return NextResponse.json({ 
      success: true, 
      image: newImage,
      message: 'Image saved successfully'
    })

  } catch (error) {
    console.error('Save image error:', error)
    return NextResponse.json({ 
      error: 'Save failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
