"use client";
import { ServiceBlock } from "@/components/service-block"
import { useRef, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";

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
      "/res.jpg",
      "/res1.jpg",
      "/res2.jpg",
      "/res3.jpg",
      "/res4.jpg",
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
  {
    id: 5,
    title: "EV Charger Installation",
    description:
      "Power your electric vehicle with confidence. Our licensed electricians provide fast, reliable EV charger installation for homes and businesses. Whether you need a Level 2 home charger or a commercial charging station, we ensure safe, code-compliant setup tailored to your needs.",
    images: [
      "/ev.jpg",
      
    ],
  },
   {
    id: 6,
    title: "Residential & Commercial Generator Installation",
    description:
      "Stay powered through any outage with expert generator installation for homes and businesses. We install and service reliable standby generators tailored to your property's specific needs—whether it's a whole-home system or a commercial-grade backup solution.",
    images: [
      "/_com1.jpg",
      
    ],
  },
]

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const headerVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const serviceCardLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const serviceCardRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const sparkleVariants: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function ServicesSection() {
  const serviceRefs = useRef({});
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect for background elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-20%"]);
  
  // Handle hash navigation on page load
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
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
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  const handleJump = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navbarHeight = window.innerWidth < 1024 ? 200 : 180;
      const targetPosition = rect.top + scrollTop - navbarHeight;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-black relative overflow-hidden" ref={sectionRef}>
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full"
          initial="initial"
          animate="animate"
          variants={floatingVariants}
        />
        <motion.div
          className="absolute top-3/4 right-20 w-24 h-24 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full"
          initial="initial"
          animate="animate"
          variants={floatingVariants}
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-red-400/5 to-transparent rounded-full"
          initial="initial"
          animate="animate"
          variants={sparkleVariants}
        />
      </motion.div>

      <section className="py-20 md:py-28 lg:py-32 relative z-10">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-[95vw] xl:max-w-[1600px]">
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20 lg:mb-24"
            style={{ y: headerY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={headerVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
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
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
            viewport={{ once: true, margin: "-150px" }}
          >
            {services.map((service, index) => {
              const cardRef = useRef(null);
              const isInView = useInView(cardRef, { 
                once: true, 
                margin: "-50px",
                amount: 0.2 
              });

              return (
                <motion.div
                  key={service.id}
                  ref={cardRef}
                  className="group relative"
                  variants={index % 2 === 0 ? serviceCardLeftVariants : serviceCardRightVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  style={{
                    transformPerspective: 1000
                  }}
                >
                  <span
                    id={normalizeSlug(service.title)}
                    className="block scroll-mt-[96px] h-0"
                    aria-hidden="true"
                  />
                  
                  {/* Background Card */}
                  <motion.div
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 min-h-[500px] md:min-h-[600px] shadow-2xl border border-gray-200/50 transition-all duration-500 ease-out flex items-center relative overflow-hidden"
                    whileHover={{
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                  >
                    
                    {/* Animated gradient overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-50/50 rounded-3xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Service Content */}
                    <div className="relative z-10 w-full">
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.1,
                          ease: "easeOut"
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
                    
                    {/* Decorative elements with animation */}
                    <motion.div 
                      className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1.2 }}
                      transition={{ duration: 0.7 }}
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-full blur-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1.1 }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Bottom CTA Section */}
          <motion.div 
            className="mt-20 md:mt-24 lg:mt-28 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 text-gray-400 text-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-12 h-px bg-gradient-to-r from-transparent to-gray-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <span className="px-4 font-medium">Professional • Licensed • Insured</span>
              <motion.div 
                className="w-12 h-px bg-gradient-to-l from-transparent to-gray-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}