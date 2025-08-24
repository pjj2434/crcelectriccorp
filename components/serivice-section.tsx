"use client";
import { ServiceBlock } from "@/components/service-block"
import { useRef, useEffect, useState, useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, useInView, type Variants } from "framer-motion";

// Service categories mapping
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
  serviceCategory: string
  isActive: number
  createdAt: number
}

// Service descriptions (keeping these static)
const serviceDescriptions = {
  'landscape': "Transform your property with sophisticated outdoor lighting solutions that enhance both aesthetics and security. Our expert team specializes in energy-efficient LED systems, architectural accent lighting, and smart automation controls that create stunning nighttime landscapes while providing lasting value for residential and commercial properties throughout Suffolk and Nassau County.",
  'pool': "Ensure complete safety and compliance with our specialized aquatic electrical services. CRC Electric provides comprehensive electrical solutions for pools, hot tubs, spas, and saunas, including GFCI protection, underwater lighting systems, and equipment connections. Our certified technicians follow strict safety protocols and local codes to deliver reliable installations that protect your family and investment.",
  'residential': "Comprehensive electrical solutions tailored to modern homeowners' needs. From electrical panel upgrades and circuit installations to smart home integration and energy-efficient lighting retrofits, our licensed electricians deliver reliable service with attention to detail. We prioritize safety, code compliance, and long-term performance in every residential project across Long Island.",
  'commercial': "Maximize operational efficiency with tailored commercial electrical services designed for business continuity. Our experienced team handles complex projects including office buildouts, retail lighting systems, industrial power distribution, and emergency electrical services. We work efficiently to minimize disruption while ensuring your electrical infrastructure supports your business goals throughout Suffolk and Nassau County.",
  'ev': "Power your electric vehicle with confidence. Our licensed electricians provide fast, reliable EV charger installation for homes and businesses. Whether you need a Level 2 home charger or a commercial charging station, we ensure safe, code-compliant setup tailored to your needs.",
  'generator': "Stay powered through any outage with expert generator installation for homes and businesses. We install and service reliable standby generators tailored to your property's specific needs—whether it's a whole-home system or a commercial-grade backup solution."
}

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
      delayChildren: 0.6
    }
  }
};

const headerVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2.0,
      ease: "easeOut"
    }
  }
};

const serviceCardLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -50,
    y: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const serviceCardRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 50,
    y: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const sparkleVariants: Variants = {
  initial: { scale: 1, opacity: 0.2 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.2, 0.5, 0.2],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Service Card Component to handle individual refs
function ServiceCard({ service, index }: { service: any, index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { 
    once: true, 
    margin: "-30px",
    amount: 0.1
  });

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      variants={index % 2 === 0 ? serviceCardLeftVariants : serviceCardRightVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
    >
      <span
        id={normalizeSlug(service.title)}
        className="block scroll-mt-[96px] h-0"
        aria-hidden="true"
      />
      
      {/* Background Card */}
      <motion.div
        className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 min-h-[500px] md:min-h-[600px] shadow-xl border border-gray-200/50 transition-all duration-500 ease-out flex items-center relative overflow-hidden"
        whileHover={{
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.6 }
        }}
      >
        
        {/* Gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-gray-50/30 rounded-3xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Service Content */}
        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ 
              duration: 1.0,
              delay: index * 0.15,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            <ServiceBlock
              title={service.title}
              description={service.description}
              images={service.images}
              isReversed={index % 2 !== 0}
              serviceSlug={service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}
              slideshowSize="large"
            />
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/10 to-transparent rounded-full blur-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imagesByCategory, setImagesByCategory] = useState<Record<string, ServiceImage[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load service images from API
  useEffect(() => {
    const loadServiceImages = async () => {
      try {
        const response = await fetch('/api/service-images')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setImagesByCategory(data.imagesByCategory || {})
          }
        }
      } catch (error) {
        console.error('Error loading service images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServiceImages()
  }, [])

  // Create services array with dynamic images - memoized to prevent recreation
  const services = useMemo(() => {
    return Object.entries(SERVICE_CATEGORIES).map(([key, title], index) => {
      const categoryImages = imagesByCategory[key] || []
      const imageUrls = categoryImages
        .filter(img => img.isActive === 1)
        .sort((a, b) => b.createdAt - a.createdAt) // Most recent first
        .map(img => img.url)

      return {
        id: index + 1,
        title,
        description: serviceDescriptions[key as keyof typeof serviceDescriptions],
        images: imageUrls.length > 0 ? imageUrls : ['/placeholder-service.jpg'], // Fallback image
        categoryKey: key
      }
    })
  }, [imagesByCategory])

  // Handle hash navigation on page load
  useEffect(() => {
    if (!isMounted) return

    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash.trim() !== '') {
        // Only scroll if there's a valid hash
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbarHeight = window.innerWidth < 1024 ? 200 : 180;
            const targetPosition = rect.top + scrollTop - navbarHeight;
            
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });
          }
        }, 500);
      }
      // If no hash, don't scroll anywhere - let the page stay at its natural position
    };

    // Only run hash scroll if there's actually a hash in the URL
    if (window.location.hash) {
      handleHashScroll();
    }
    
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [isMounted]);

  // Loading state is now handled by Suspense in the parent component
  // This prevents scroll jumping during loading transitions

  return (
    <div className="bg-black relative overflow-hidden" ref={sectionRef}>
      {/* Background elements - only render after mounting */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-red-500/3 to-transparent rounded-full blur-2xl"
            initial="initial"
            animate="animate"
            variants={floatingVariants}
          />
          <motion.div
            className="absolute top-3/4 right-20 w-16 h-16 bg-gradient-to-tl from-blue-500/3 to-transparent rounded-full blur-2xl"
            initial="initial"
            animate="animate"
            variants={floatingVariants}
            transition={{ delay: 6 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-to-r from-red-400/2 to-transparent rounded-full blur-xl"
            initial="initial"
            animate="animate"
            variants={sparkleVariants}
          />
        </div>
      )}

      <section className="py-20 md:py-28 lg:py-32 relative z-10">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-[95vw] xl:max-w-[1600px]">
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20 lg:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={headerVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-red-600 mb-6 leading-tight">
                Professional Electrical Services in Long Island, NY
              </h2>
            </motion.div>
            
            <motion.p
              className="text-lg md:text-xl text-red-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              Delivering exceptional electrical solutions for residential and commercial properties 
              throughout Long Island with uncompromising quality and reliability
            </motion.p>
          </motion.div>
          
          {/* Services Grid */}
          <motion.div 
            className="space-y-16 md:space-y-20 lg:space-y-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
              />
            ))}
          </motion.div>
          
          {/* Bottom CTA Section */}
          <motion.div 
            className="mt-20 md:mt-24 lg:mt-28 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 text-gray-400 text-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="w-12 h-px bg-gradient-to-r from-transparent to-gray-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              <span className="px-4 font-medium">Professional • Licensed • Insured</span>
              <motion.div 
                className="w-12 h-px bg-gradient-to-l from-transparent to-gray-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
