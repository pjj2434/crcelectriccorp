"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Upload, Image, LogOut } from "lucide-react"
import { toast } from "sonner"
import { UploadButton } from "@/utils/uploadthing"
import { useSession } from "@/lib/auth-client" // Better Auth client hook

// Empty sections - no placeholder images
const sections = [
  {
    name: "Custom Lighting Installation",
    table: "custom_lighting_installation",
    images: []
  },
  {
    name: "Landscape & Outdoor Lighting",
    table: "landscape_outdoor_lighting", 
    images: []
  },
  {
    name: "Pool & Sauna Electrical",
    table: "pool_sauna_electrical",
    images: []
  },
  {
    name: "TV Mounting & Wiring",
    table: "tv_mounting_wiring",
    images: []
  },
  {
    name: "Electrical Panels & Upgrades", 
    table: "electrical_panels_upgrades",
    images: []
  },
  {
    name: "Accent & Specialty Lighting",
    table: "accent_specialty_lighting",
    images: []
  }
]

export default function AdminPage() {
  const { data: session, isPending } = useSession()
  const [title, setTitle] = useState("")
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sectionsData, setSectionsData] = useState(sections)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      window.location.href = '/sign-in'
    }
  }, [session, isPending])

  // Load images for all sections
  useEffect(() => {
    if (session) {
      loadAllImages()
    }
  }, [session])

  const loadAllImages = async () => {
    try {
      const updatedSections = await Promise.all(
        sections.map(async (section) => {
          try {
            const response = await fetch(`/api/get-images?section=${section.table}`)
            if (response.ok) {
              const data = await response.json()
              return { ...section, images: data.images || [] }
            }
            return section
          } catch (error) {
            console.error(`Error loading images for ${section.table}:`, error)
            return section
          }
        })
      )
      setSectionsData(updatedSections)
    } catch (error) {
      console.error('Error loading images:', error)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleUploadComplete = (res: any) => {
    console.log("Upload complete:", res);
    setUploadedFile(res[0])
    toast.success("File uploaded! Now add a title and submit.")
  }

  const handleSubmit = async () => {
    console.log("Submit clicked", { title, uploadedFile, currentSection });
    
    if (!title || !uploadedFile) {
      toast.error("Please enter a title and upload a file")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title,
        url: uploadedFile.url,
        fileKey: uploadedFile.key,
        section: currentSection,
      };
      
      console.log("Sending payload:", payload);

      const response = await fetch('/api/save-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        toast.success("Image saved successfully")
        setTitle("")
        setUploadedFile(null)
        setOpenDialog(null)
        // Reload images
        await loadAllImages()
      } else {
        toast.error(responseData.error || "Failed to save image")
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error saving image")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (imageId: string, sectionTable: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId, section: sectionTable }),
      })

      if (response.ok) {
        toast.success("Image deleted successfully")
        await loadAllImages()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete image")
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting image")
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      window.location.href = '/sign-in'
    } catch (error) {
      console.error("Sign out error:", error)
      window.location.href = '/sign-in'
    }
  }

  const resetForm = () => {
    setTitle("")
    setUploadedFile(null)
    setOpenDialog(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin - Manage Images</h1>
          <p className="text-muted-foreground">Welcome, {session.user.name || session.user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <div className="grid gap-8">
        {sectionsData.map((section) => (
          <Card key={section.table}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{section.name}</CardTitle>
                <CardDescription>
                  {section.images.length} image{section.images.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              
              <Dialog 
                open={openDialog === section.table} 
                onOpenChange={(open) => {
                  if (open) {
                    setCurrentSection(section.table)
                    setOpenDialog(section.table)
                  } else {
                    resetForm()
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Add Image to {section.name}
                    </DialogTitle>
                    <DialogDescription>
                      Upload a new image and add a title
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Image Title *
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title"
                        className="h-10"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label className="text-sm font-medium">
                        Upload Image *
                      </Label>
                      
                      {uploadedFile ? (
                        <div className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Image className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-900">
                                File uploaded successfully!
                              </p>
                              <p className="text-xs text-green-600">
                                {uploadedFile.name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadedFile(null)}
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 4MB
                              </p>
                            </div>
                            
                            <div className="w-full">
                              <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={handleUploadComplete}
                                onUploadError={(error: Error) => {
                                  console.error("Upload error:", error);
                                  toast.error(`Upload failed: ${error.message}`)
                                }}
                                appearance={{
                                  button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors ut-ready:bg-blue-600 ut-uploading:bg-blue-500 ut-uploading:after:bg-blue-400",
                                  container: "w-full",
                                  allowedContent: "hidden"
                                }}
                                content={{
                                  button({ ready, isUploading }) {
                                    if (isUploading) return (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                      </div>
                                    )
                                    if (ready) return (
                                      <div className="flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Choose Image
                                      </div>
                                    )
                                    return "Getting ready..."
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!title || !uploadedFile || isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </div>
                      ) : (
                        "Save Image"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {section.images.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No images yet</p>
                  <p className="text-sm text-gray-400">Click "Add Image" to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.images.map((image: any) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image load error:", image.url);
                            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.id, section.table)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Session: {session ? 'Authenticated' : 'Not authenticated'}</p>
        <p>User: {session?.user?.email}</p>
        <p>Current Section: {currentSection}</p>
        <p>Uploaded File: {uploadedFile ? 'Yes' : 'No'}</p>
        <p>Title: {title}</p>
      </div>
    </div>
  )
}
