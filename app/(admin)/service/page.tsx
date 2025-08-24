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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { UploadButton } from "@/utils/uploadthing"
import { useSession } from "@/lib/auth-client"

const SERVICE_CATEGORIES = {
  'landscape': 'LANDSCAPE & OUTDOOR LIGHTING',
  'pool': 'POOL & SAUNA ELECTRICAL', 
  'residential': 'RESIDENTIAL ELECTRICAL SERVICES',
  'commercial': 'COMMERCIAL ELECTRICAL SOLUTIONS',
  'ev': 'EV Charger Installation',
  'generator': 'Residential & Commercial Generator Installation'
}

interface ServiceImage {
  id: string
  title: string
  url: string
  fileKey?: string
  serviceCategory: string
  isActive: number
  createdAt: number
  updatedAt: number
  uploadedBy?: string
}

export default function AdminPage() {
  const { data: session } = useSession()
  
  // State
  const [imagesByCategory, setImagesByCategory] = useState<Record<string, ServiceImage[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    serviceCategory: '',
  })
  const [uploadedFile, setUploadedFile] = useState<any>(null)

  // Load images on mount
  useEffect(() => {
    loadServiceImages()
  }, [])

  // Load all service images
  const loadServiceImages = async () => {
    setIsLoading(true)
    try {
      console.log('📖 Loading service images...')
      const response = await fetch('/api/service-images')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setImagesByCategory(data.imagesByCategory || {})
        console.log(`✅ Loaded ${data.totalImages} service images ${data.cached ? '(from cache)' : '(fresh)'}`)
        
        if (data.cached) {
          toast.success(`Loaded ${data.totalImages} service images from cache`)
        }
      } else {
        throw new Error(data.error || 'Failed to load service images')
      }
    } catch (error) {
      console.error('Error loading service images:', error)
      toast.error('Failed to load service images')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file upload completion
  const handleUploadComplete = (res: any) => {
    if (res && res[0]) {
      setUploadedFile(res[0])
      toast.success("File uploaded! Now add details and submit.")
    } else {
      toast.error("Upload failed")
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title")
      return
    }
    
    if (!formData.serviceCategory) {
      toast.error("Please select a service category")
      return
    }
    
    if (!uploadedFile) {
      toast.error("Please upload an image")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title.trim(),
        url: uploadedFile.url,
        fileKey: uploadedFile.key,
        serviceCategory: formData.serviceCategory,
      }

      const response = await fetch('/api/service-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Service image saved successfully")
        resetForm()
        await loadServiceImages()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to save service image")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Error saving service image")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setIsDeleting(imageId)
    try {
      const response = await fetch(`/api/service-images/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Service image deleted successfully")
        await loadServiceImages()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete service image")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Error deleting service image")
    } finally {
      setIsDeleting(null)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      serviceCategory: '',
    })
    setUploadedFile(null)
    setOpenDialog(false)
  }

  // Calculate total images
  const totalImages = Object.values(imagesByCategory).reduce((sum, images) => sum + images.length, 0)

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">CRC Service Images</h1>
          <p className="text-muted-foreground">
            Welcome, {session?.user?.name || session?.user?.email} • {totalImages} total images
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadServiceImages}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Add Image Dialog */}
      <div className="mb-6">
        <Dialog open={openDialog} onOpenChange={(open) => {
          if (!open) resetForm()
          setOpenDialog(open)
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Service Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Service Image</DialogTitle>
              <DialogDescription>
                Upload an image for a service category
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Service Category */}
              <div className="grid gap-2">
                <Label>Service Category *</Label>
                <Select
                  value={formData.serviceCategory}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title">Image Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                />
              </div>
              
              {/* File Upload */}
              <div className="grid gap-3">
                <Label>Upload Image *</Label>
                
                {uploadedFile ? (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">File uploaded!</p>
                        <p className="text-xs text-green-600">{uploadedFile.name}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)}>
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={handleUploadComplete}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`)
                      }}
                      appearance={{
                        button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md",
                        container: "w-full",
                        allowedContent: "hidden"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Dialog Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Image'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Categories */}
      <div className="grid gap-8">
        {Object.entries(SERVICE_CATEGORIES).map(([categoryKey, categoryLabel]) => {
          const categoryImages = imagesByCategory[categoryKey] || []
          
          return (
            <Card key={categoryKey}>
              <CardHeader>
                <CardTitle>{categoryLabel}</CardTitle>
                <CardDescription>
                  {categoryImages.length} image{categoryImages.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {categoryImages.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images for this service yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                            disabled={isDeleting === image.id}
                          >
                            {isDeleting === image.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium truncate">{image.title}</p>
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
          )
        })}
      </div>
    </div>
  )
}
