import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, url, fileKey, section } = await request.json()

    if (!title || !url || !fileKey || !section) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const table = sectionTables[section as keyof typeof sectionTables]
    if (!table) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    await db.insert(table).values({
      id: crypto.randomUUID(),
      title,
      url,
      fileKey,
      uploadedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}