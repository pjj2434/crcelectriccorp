import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { 
  customLightingInstallation,
  landscapeOutdoorLighting,
  poolSaunaElectrical,
  tvMountingWiring,
  electricalPanelsUpgrades,
  accentSpecialtyLighting
} from '@/db/schema'

const sectionTables = {
  'custom_lighting_installation': customLightingInstallation,
  'landscape_outdoor_lighting': landscapeOutdoorLighting,
  'pool_sauna_electrical': poolSaunaElectrical,
  'tv_mounting_wiring': tvMountingWiring,
  'electrical_panels_upgrades': electricalPanelsUpgrades,
  'accent_specialty_lighting': accentSpecialtyLighting,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    console.log("Get images for section:", section);

    if (!section) {
      return NextResponse.json({ error: 'Section required' }, { status: 400 })
    }

    const table = sectionTables[section as keyof typeof sectionTables]
    if (!table) {
      console.log("Invalid section:", section);
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    const images = await db.select().from(table).where(eq(table.isActive, true))
    
    console.log(`Found ${images.length} images for ${section}`);
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ 
      error: 'Fetch failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
