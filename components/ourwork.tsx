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
  image: string;
  alt: string;
}

interface WorkSection {
  id: string;
  title: string;
  slides: SlideData[];
}

// Constants
const AUTOPLAY_INTERVAL = 3500;
const PAUSE_DURATION = 10000;
const ANIMATION_DURATION = 700;

// Data
const workSections: WorkSection[] = [
  {
    //done
    id: "custom-lighting",
    title: "Custom Lighting Installation",
    slides: [
      {
        id: "slide1",

        title: "Chandelier Setup",

        image: "/clight2.jpg",

        alt: "Elegant chandelier installation",
      },

      {
        id: "slide2",

        title: "Chandelier Setup",

        image: "/clight3.jpg",

        alt: "Elegant chandelier installation",
      },

      {
        id: "slide3",

        title: "Chandelier Setup",

        image: "/clight4.jpg",

        alt: "Elegant chandelier installation",
      },

      {
        id: "slide4",

        title: "Under-Cabinet LED",

        image: "/clight5.jpg",

        alt: "Under-cabinet LED lighting",
      },

      {
        id: "slide5",

        title: "Under-Cabinet LED",

        image: "/clight6.jpg",

        alt: "Under-cabinet LED lighting",
      },

      {
        id: "slide6",

        title: "Under-Cabinet LED",

        image: "/clight8.jpg",

        alt: "Under-cabinet LED lighting",
      },

      {
        id: "slide7",

        title: "Modern Pendant Installation",

        image: "/clight9.jpg",

        alt: "Custom pendant lighting installation",
      },

      {
        id: "slide8",

        title: "Chandelier Setup",

        image: "/clight11.jpg",

        alt: "Elegant chandelier installation",
      },

      
    ],
  },
  {
    id: "landscape-outdoor",
    title: "Landscape & Outdoor Lighting",
    slides: [
      {
        //done
        id: "pic1",

        title: "",

        image: "/outdoor1.jpg",

        alt: "",
      },

      {
        id: "pic2",

        title: "",

        image: "/outdoor2.jpg",

        alt: "",
      },

      {
        id: "pic3",

        title: "",

        image: "/outdoor3.jpg",

        alt: "",
      },
    ],
  },
  {
    id: "pool-sauna",
    title: "Pool & Sauna Electrical",
    slides: [
      {
        id: "pic1",
        title: "Pool Equipment Wiring",
        image: "/pool1.jpg",
        alt: "Pool equipment wiring",
      },
      {
        id: "pic2",
        title: "Pool panel Wiring",
        image: "/pool2.jpg",
        alt: "Underwater panel lighting",
      },
      {
        id: "pic3",
        title: "Pool Equipment Wiring",
        image: "/pool3.jpg",
        alt: "Pool Equipment Wiring",
      },
   
    ],
  },
  {
    id: "tv-mounting",
    title: "TV Mounting & Wiring",
    slides: [
      {
        id: "slideA",
        title: "Wall-Mounted TV Setup",
        image: "/tv1.jpg",
        alt: "Wall-mounted TV installation",
      },
      {
        id: "slideB",
        title: "Home Theater Wiring",
        image: "/tv.jpg",
        alt: "Home theater wiring system",
      },
    ],
  },
  {
    id: "panels-electrical",
    title: "Electrical Panels & Upgrades",
    slides: [
      {
        id: "pic1",
        title: "Main Panel Upgrade",
        image: "/pan1.jpg",
        alt: "Main electrical panel upgrade",
      },
      {
        id: "pic2",
        title: "Main Panel Upgrade",
        image: "/pan2.jpg",
        alt: "Main electrical panel upgrade",
      },
     
    ],
  },
  {
    id: "accent-specialty",
    title: "Accent & Specialty Lighting",
    slides: [
     {
        //done
        id: "pic1",

        title: "Track Lighting System",

        image: "/clight1.jpg",

        alt: "Track lighting system installation",
      },

      {
        id: "pic2",

        title: "Track Lighting System",

        image: "/clight10.jpg",

        alt: "Track lighting system installation",
      },

      {
        id: "pic3",

        title: "Track Lighting System",

        image: "/clight7.jpg",

        alt: "Track lighting system installation",
      },
    ],
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
                src={slide.image || "/placeholder.svg?height=400&width=400"}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => index === 0 && setIsLoading(false)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}

          {/* Preload next image */}
          {section.slides.length > 1 && (
            <div className="hidden">
              <Image
                src={
                  nextSlideData.image || "/placeholder.svg?height=400&width=400"
                }
                alt={nextSlideData.alt}
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
                aria-label={`Previous slide. Currently showing ${currentSlideData.title}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Next slide. Currently showing ${currentSlideData.title}`}
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
    []
  );

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
