import { Slideshow } from "@/components/slideshow"
import Link from "next/link"

interface ServiceBlockProps {
  title: string
  description: string
  images: string[]
  isReversed?: boolean
  serviceSlug?: string
  slideshowSize?: 'small' | 'medium' | 'large' | 'xl'
}

export function ServiceBlock({ 
  title, 
  description, 
  images, 
  isReversed = false, 
  serviceSlug,
  slideshowSize = 'medium'
}: ServiceBlockProps) {
  
  // Define size configurations
  const sizeConfig = {
    small: {
      grid: "grid-cols-1 gap-6 md:grid-cols-5",
      textCol: "md:col-span-3",
      imageCol: "md:col-span-2",
      aspectRatio: "aspect-[4/3]"
    },
    medium: {
      grid: "grid-cols-1 gap-8 md:grid-cols-2",
      textCol: "",
      imageCol: "",
      aspectRatio: "aspect-video"
    },
    large: {
      grid: "grid-cols-1 gap-8 md:grid-cols-5",
      textCol: "md:col-span-2",
      imageCol: "md:col-span-3",
      aspectRatio: "aspect-video"
    },
    xl: {
      grid: "grid-cols-1 gap-10 md:grid-cols-3",
      textCol: "md:col-span-1",
      imageCol: "md:col-span-2",
      aspectRatio: "aspect-[16/10]"
    }
  }

  const config = sizeConfig[slideshowSize]

  return (
    <div className={`grid ${config.grid} items-center`}>
      {/* Description Section */}
      <div className={`space-y-6 ${config.textCol} ${isReversed ? "md:order-last" : ""}`}>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <div>
          <Link 
            href={`/contact?service=${encodeURIComponent(serviceSlug || title)}`}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Free Quote Today ➜
          </Link>
        </div>
      </div>

      {/* Slideshow Section */}
      <div className={`${config.imageCol} ${isReversed ? "md:order-first" : ""}`}>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <div className={`aspect-[4/5] md:aspect-[16/10]`}>
            <Slideshow images={images} />
          </div>
        </div>
      </div>
    </div>
  )
}
