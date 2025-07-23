// components/Hero.tsx - Better word transitions
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Hero: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const words = ["WIRING.", "LIGHTNING.", "INSTALLATIONS.", "SOLUTIONS."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsTransitioning(false);
      }, 250); // Half of transition duration
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <>
      <style jsx>{`
        .word-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .word-exit {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }

        .word-enter {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      {/* SPACER FOR NAVBAR */}
      <div className="h-0 lg:h-0"></div>

      <section className="relative w-full min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.PNG" // Correct filename
            alt="Electrical work background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-opacity-60"></div>
        </div>

        {/* Hero Content - LEFT ALIGNED */}
        <div className="relative z-10 flex items-center min-h-screen px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-4xl py-20">
            {/* Main Heading - RESPONSIVE LINE BREAKS */}
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight mb-2">
              POWER YOUR
              <br />
              PROPERTY WITH
              <br />
              <span className="text-gray-200">EXPERT</span>
            </h1>

            {/* Animated Word - SMOOTHER TRANSITIONS */}
            <div className="mb-6 h-16 sm:h-12 md:h-16 lg:h-20 xl:h-24 flex items-center">
              <h2
                className={`text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-red-500 tracking-tight word-transition ${
                  isTransitioning ? "word-exit" : "word-enter"
                }`}
              >
                {words[currentWordIndex]}
              </h2>
            </div>

            {/* New Subtitle */}
            <p className="text-lg sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
              CRC Electrical powers homes and businesses across Long Island with
              expert service in Suffolk and Nassau County.
            </p>

            {/* Call to Action Buttons - RESPONSIVE LAYOUT */}
            <div className="flex flex-col gap-4 items-start">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25">
                Get Expert Electrical Service Today! →
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                All Our Services →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
