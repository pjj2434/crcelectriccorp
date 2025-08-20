"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";

// Types
interface SlideData {
  id: string;
  title: string;
  url: string; // Changed from 'image' to 'url' to match your database
  createdAt: string;
  isActive: boolean;
}

interface WorkSection {
  id: string;
  title: string;
  table: string; // Added table name for API calls
  slides: SlideData[];
}

// Constants
const AUTOPLAY_INTERVAL = 3500;
const PAUSE_DURATION = 10000;
const ANIMATION_DURATION = 700;

// Section configuration - maps to your database tables
const workSectionsConfig = [
  {
    id: "custom-lighting",
    title: "Custom Lighting Installation",
    table: "custom_lighting_installation",
  },
  {
    id: "landscape-outdoor",
    title: "Landscape & Outdoor Lighting",
    table: "landscape_outdoor_lighting",
  },
  {
    id: "pool-sauna",
    title: "Pool & Sauna Electrical",
    table: "pool_sauna_electrical",
  },
  {
    id: "tv-mounting",
    title: "TV Mounting & Wiring",
    table: "tv_mounting_wiring",
  },
  {
    id: "panels-electrical",
    title: "Electrical Panels & Upgrades",
    table: "electrical_panels_upgrades",
  },
  {
    id: "accent-specialty",
    title: "Accent & Specialty Lighting",
    table: "accent_specialty_lighting",
  },
];

// Custom hook for slideshow logic
function useSlideshow(slidesLength: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
    setIsAutoPlaying(false);

    setTimeout(() => {
      setIsPaused(false);
      setIsAutoPlaying(true);
    }, PAUSE_DURATION);
  }, []);

  const toggleAutoplay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || isPaused || slidesLength <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesLength);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [slidesLength, isAutoPlaying, isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesLength);
    pauseAutoplay();
  }, [slidesLength, pauseAutoplay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesLength) % slidesLength);
    pauseAutoplay();
  }, [slidesLength, pauseAutoplay]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      pauseAutoplay();
    },
    [pauseAutoplay]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextSlide();
          break;
        case " ":
          event.preventDefault();
          toggleAutoplay();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleAutoplay]);

  return {
    currentSlide,
    isAutoPlaying,
    isPaused,
    isLoading,
    setIsLoading,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoplay,
  };
}

// Custom hook for swipe functionality
function useSwipeable(handlers: {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handlers.onSwipedLeft();
    } else if (isRightSwipe) {
      handlers.onSwipedRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Memoized slideshow component
const Slideshow = React.memo<{ section: WorkSection }>(({ section }) => {
  const {
    currentSlide,
    isAutoPlaying,
    isLoading,
    setIsLoading,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoplay,
  } = useSlideshow(section.slides.length);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  // Preload next image for smoother transitions
  const nextSlideIndex = (currentSlide + 1) % section.slides.length;
  const currentSlideData = section.slides[currentSlide];
  const nextSlideData = section.slides[nextSlideIndex];

  // Don't render if no slides
  if (!section.slides.length) {
    return (
      <article className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 group rounded-2xl overflow-hidden">
        <header className="bg-black px-6 py-4">
          <h3 className="text-white font-bold text-xl text-center tracking-wide">
            {section.title}
          </h3>
        </header>
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500 text-center">No images available</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 group rounded-2xl overflow-hidden"
      {...swipeHandlers}
    >
      {/* Header */}
      <header className="bg-black px-6 py-4">
        <h3 className="text-white font-bold text-xl text-center tracking-wide">
          {section.title}
        </h3>
      </header>

      {/* Image Container */}
      <div
        className="relative aspect-square bg-gray-900 overflow-hidden"
        role="img"
        aria-label={`${section.title} slideshow`}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Main Image Display */}
        <div className="relative w-full h-full">
          {section.slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              <Image
                src={slide.url || "/placeholder.svg?height=400&width=400"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => index === 0 && setIsLoading(false)}
                onError={(e) => {
                  console.error("Image load error:", slide.url);
                  // Optionally set a fallback image
                  (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400";
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}

          {/* Preload next image */}
          {section.slides.length > 1 && nextSlideData && (
            <div className="hidden">
              <Image
                src={nextSlideData.url || "/placeholder.svg?height=400&width=400"}
                alt={nextSlideData.title}
                width={1}
                height={1}
                loading="lazy"
              />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

          {/* Controls - Only show if more than 1 slide */}
          {section.slides.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Previous slide. Currently showing ${currentSlideData?.title}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Next slide. Currently showing ${currentSlideData?.title}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={toggleAutoplay}
                className="absolute top-4 left-4 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={
                  isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                }
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              {/* Slide Counter */}
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm z-30">
                {currentSlide + 1} / {section.slides.length}
              </div>

              {/* Progress Dots */}
              <nav
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30"
                aria-label="Slide navigation"
              >
                {section.slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      index === currentSlide
                        ? "bg-red-600 w-6 h-2"
                        : "bg-white/60 hover:bg-white/80 w-2 h-2"
                    }`}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                  />
                ))}
              </nav>
            </>
          )}

          {/* Slide Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
            <h4 className="text-white text-lg font-semibold drop-shadow-lg">
              {currentSlideData?.title}
            </h4>
          </div>
        </div>
      </div>
    </article>
  );
});

Slideshow.displayName = "Slideshow";

// Main component
const OurWork: React.FC = () => {
  const [workSections, setWorkSections] = useState<WorkSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from database
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sectionsWithImages = await Promise.all(
          workSectionsConfig.map(async (config) => {
            try {
              const response = await fetch(`/api/get-images?section=${config.table}`);
              
              if (!response.ok) {
                console.error(`Failed to fetch images for ${config.table}:`, response.status);
                return {
                  ...config,
                  slides: [],
                };
              }

              const data = await response.json();
              
              return {
                ...config,
                slides: data.images || [],
              };
            } catch (error) {
              console.error(`Error fetching images for ${config.table}:`, error);
              return {
                ...config,
                slides: [],
              };
            }
          })
        );

        setWorkSections(sectionsWithImages);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to load images. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  // Memoize the grid to prevent unnecessary re-renders
  const slideshowGrid = useMemo(
    () =>
      workSections.map((section) => (
        <div
          key={section.id}
          className="transform hover:scale-[1.02] transition-transform duration-300"
        >
          <Slideshow section={section} />
        </div>
      )),
    [workSections]
  );

  if (isLoading) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading our work...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20" aria-labelledby="our-work-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <h1
            id="our-work-heading"
            className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight"
          >
            Our Work
          </h1>
          <div
            className="w-24 h-1 bg-red-600 mx-auto mb-6"
            aria-hidden="true"
          />
          <h2 className="text-2xl md:text-3xl text-red-600 font-bold mb-8">
            Powering Long Island Homes & Businesses
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            Explore our portfolio of professional electrical installations
            across Nassau and Suffolk County. From custom lighting solutions to
            complete electrical system upgrades, see the quality craftsmanship
            that sets CRC Electric apart.
          </p>
        </header>

        {/* Grid of Slideshows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {slideshowGrid}
        </div>
      </div>
    </section>
  );
};

export default OurWork;
