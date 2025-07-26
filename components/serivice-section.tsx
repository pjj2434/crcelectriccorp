"use client";
import { ServiceBlock } from "@/components/service-block"
import { useRef, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Sample service data
const services = [
  {
    id: 1,
    title: "LANDSCAPE & OUTDOOR LIGHTING",
    description:
      "Transform your property with sophisticated outdoor lighting solutions that enhance both aesthetics and security. Our expert team specializes in energy-efficient LED systems, architectural accent lighting, and smart automation controls that create stunning nighttime landscapes while providing lasting value for residential and commercial properties throughout Suffolk and Nassau County.",
    images: [
      "/outdoor1.jpg",
      "/outdoor2.jpg",
      "/outdoor3.jpg",
    ],
  },
  {
    id: 2,
    title: "POOL & SAUNA ELECTRICAL",
    description:
      "Ensure complete safety and compliance with our specialized aquatic electrical services. CRC Electric provides comprehensive electrical solutions for pools, hot tubs, spas, and saunas, including GFCI protection, underwater lighting systems, and equipment connections. Our certified technicians follow strict safety protocols and local codes to deliver reliable installations that protect your family and investment.",
    images: [
      "/pool1.jpg",
      "/pool2.jpg",
      "/pool3.jpg",
    ],
  },
  {
    id: 3,
    title: "RESIDENTIAL ELECTRICAL SERVICES",
    description:
      "Comprehensive electrical solutions tailored to modern homeowners' needs. From electrical panel upgrades and circuit installations to smart home integration and energy-efficient lighting retrofits, our licensed electricians deliver reliable service with attention to detail. We prioritize safety, code compliance, and long-term performance in every residential project across Long Island.",
    images: [
      "/res1.jpg",
      "/res2.jpg",
      "/res3.jpg",
      "/res4.jpg",
      "/res5.jpg",
    ],
  },
  {
    id: 4,
    title: "COMMERCIAL ELECTRICAL SOLUTIONS",
    description:
      "Maximize operational efficiency with tailored commercial electrical services designed for business continuity. Our experienced team handles complex projects including office buildouts, retail lighting systems, industrial power distribution, and emergency electrical services. We work efficiently to minimize disruption while ensuring your electrical infrastructure supports your business goals throughout Suffolk and Nassau County.",
    images: [
      "/_com1.jpg",
      
    ],
  },
]

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}


export function ServicesSection() {
  const serviceRefs = useRef({});
  
  // Handle hash navigation on page load
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            // Get the element's position relative to the document
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbarHeight = window.innerWidth < 1024 ? 200 : 180;
            
            // Calculate the target position
            const targetPosition = rect.top + scrollTop - navbarHeight;
            
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });
          }
        }, 500); // Longer delay for page load
      }
    };

    // Handle initial page load with hash
    handleHashScroll();
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  const handleJump = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      // Get the element's position relative to the document
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navbarHeight = window.innerWidth < 1024 ? 200 : 180;
      
      // Calculate the target position
      const targetPosition = rect.top + scrollTop - navbarHeight;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-black">
      <section className="py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-[95vw] xl:max-w-[1600px]">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
          
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-red-600 mb-6 leading-tight">
             Professional Electrical Services in Long Island, NY
            </h2>
            <p className="text-lg md:text-xl text-red-600 max-w-4xl mx-auto leading-relaxed">
              Delivering exceptional electrical solutions for residential and commercial properties 
              throughout Long Island with uncompromising quality and reliability
            </p>
          
          </div>
          
          {/* Services Grid */}
          <div className="space-y-16 md:space-y-20 lg:space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative"
              >
                <span
                  id={normalizeSlug(service.title)}
                  className="block scroll-mt-[96px] h-0"
                  aria-hidden="true"
                />
                {/* Background Card */}
                <div
                  className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 min-h-[500px] md:min-h-[600px] shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 ease-out transform hover:-translate-y-2 flex items-center relative overflow-hidden"
                >
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Service Content */}
                  <div className="relative z-10 w-full">
                    <ServiceBlock
  title={service.title}
  description={service.description}
  images={service.images}
  isReversed={index % 2 !== 0}
  serviceSlug={service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}
  slideshowSize="large" // Options: 'small', 'medium', 'large', 'xl'
/>

                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA Section */}
          <div className="mt-20 md:mt-24 lg:mt-28 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
              <span className="px-4 font-medium">Professional • Licensed • Insured</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}