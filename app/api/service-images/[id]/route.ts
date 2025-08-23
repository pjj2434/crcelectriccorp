import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { serviceImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params before accessing properties
    const { id: imageId } = await params

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    console.log(`🗑️ Deleting service image ${imageId}`)

    // Get image data before deletion for file cleanup
    const [imageToDelete] = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.id, imageId))

    if (!imageToDelete) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from database
    await db.delete(serviceImages).where(eq(serviceImages.id, imageId))

    // Delete file from UploadThing if fileKey exists
    if (imageToDelete.fileKey) {
      try {
        await utapi.deleteFiles([imageToDelete.fileKey])
        console.log(`🗑️ File deleted from UploadThing: ${imageToDelete.fileKey}`)
      } catch (fileError) {
        console.error('Error deleting file from UploadThing:', fileError)
        // Continue anyway - database record is already deleted
      }
    }

    // Revalidate cache
    console.log('🔄 Revalidating service images cache...')
    revalidateTag('service-images')

    console.log('✅ Service image deleted and cache revalidated')

    return NextResponse.json({ 
      success: true,
      message: 'Service image deleted successfully'
    })

  } catch (error) {
    console.error('Delete service image error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete service image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
