import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { UTApi } from "uploadthing/server"
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
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId, section } = await request.json()

    if (!imageId || !section) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const table = sectionTables[section as keyof typeof sectionTables]
    if (!table) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    // Get image info before deleting
    const [image] = await db.select().from(table).where(eq(table.id, imageId))
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Optional: Check if user owns the image (remove this if any admin can delete any image)
    // if (image.uploadedBy && image.uploadedBy !== session.user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // Delete from UploadThing if fileKey exists
    if (image.fileKey) {
      try {
        await utapi.deleteFiles([image.fileKey]);
        console.log(`Deleted file from UploadThing: ${image.fileKey}`);
      } catch (utError) {
        console.error('Error deleting from UploadThing:', utError);
        // Continue with database deletion even if UploadThing deletion fails
      }
    }

    // Delete from database
    await db.delete(table).where(eq(table.id, imageId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Delete failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
