import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { UTApi } from "uploadthing/server"
import { revalidateTag } from 'next/cache'
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

const utapi = new UTApi();

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 })
    }

    const rawBody = await request.text();
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 })
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON format', 
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error' 
      }, { status: 400 })
    }

    const { imageId, section } = parsedBody;

    if (!imageId || !section) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { imageId: !!imageId, section: !!section }
      }, { status: 400 })
    }

    const table = sectionTables[section as keyof typeof sectionTables]
    if (!table) {
      return NextResponse.json({ 
        error: 'Invalid section',
        validSections: Object.keys(sectionTables)
      }, { status: 400 })
    }

    console.log(`🗑️ Deleting image ${imageId} from ${section}`)

    // Get image info before deleting
    const [image] = await db.select().from(table).where(eq(table.id, imageId))
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from UploadThing if fileKey exists
    if (image.fileKey) {
      try {
        await utapi.deleteFiles([image.fileKey]);
        console.log(`🗑️ Deleted file from UploadThing: ${image.fileKey}`);
      } catch (utError) {
        console.error('Error deleting from UploadThing:', utError);
        // Continue with database deletion even if UploadThing deletion fails
      }
    }

    // Delete from database
    await db.delete(table).where(eq(table.id, imageId))

    // 🔥 Revalidate cache after successful delete
    console.log('🔄 Revalidating images cache...')
    revalidateTag('images')

    console.log('✅ Image deleted and cache revalidated')

    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Delete failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
