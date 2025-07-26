// components/Navbar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const services = [
  { title: "LANDSCAPE & OUTDOOR LIGHTING", slug: "landscape-outdoor-lighting" },
  { title: "POOL & SAUNA ELECTRICAL", slug: "pool-sauna-electrical" },
  { title: "RESIDENTIAL ELECTRICAL SERVICES", slug: "residential-electrical-services" },
  { title: "COMMERCIAL ELECTRICAL SOLUTIONS", slug: "commercial-electrical-solutions" },
];

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesDropdownOpen, setIsMobileServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    }
    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isServicesDropdownOpen]);

  const handleServiceJump = (slug: string) => {
    setIsServicesDropdownOpen(false);
    setIsMobileServicesDropdownOpen(false);
    setIsMenuOpen(false);
    if (pathname === '/services') {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(`/services#${slug}`);
    }
  };

  const handleMobileServicesClick = () => {
    setIsMenuOpen(false);
    router.push('/services');
  };

  return (
    <>
      {/* FIXED NAVBAR WITH HIGHER Z-INDEX AND HARDWARE ACCELERATION */}
      <nav className="absolute top-0 left-0 right-0 bg-black shadow-lg z-[100] transform-gpu will-change-transform">

        {/* Main Navigation - TALLER ON MOBILE */}
        <div className="w-full flex justify-between items-center h-48 lg:h-44">
          {/* Logo - TOUCHING LEFT EDGE */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center">
              <div className="relative h-32 w-80 lg:h-40 lg:w-[28rem] md:w-96">
                <Image
                  src="/logo.PNG"
                  alt="Company Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - PROFESSIONAL SIZE */}
          <div className="hidden lg:flex items-center space-x-12 xl:space-x-16 2xl:space-x-20 ml-auto pr-8">
            <Link 
              href="/#" 
              className="text-red-600 hover:text-red-400 text-2xl font-normal transition-colors duration-200"
            >
              About Us
            </Link>
            <div 
              className="relative" 
              ref={dropdownRef}
            >
              <Link
                href="/services"
                className="text-red-600 hover:text-red-400 text-2xl font-normal transition-colors duration-200"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
              >
                Services
              </Link>
              <button
                className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  setIsServicesDropdownOpen(!isServicesDropdownOpen);
                }}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                type="button"
              >
                <svg className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              {isServicesDropdownOpen && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-black border border-gray-800 rounded-md shadow-lg z-[110] text-center min-w-max"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  {services.map(service => (
                    <button
                      key={service.slug}
                      className="block w-full text-center px-4 py-2 text-base text-red-600 hover:bg-red-600 hover:text-white transition-colors font-normal"
                      onClick={() => handleServiceJump(normalizeSlug(service.title))}
                      type="button"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link 
              href="/work" 
              className="text-red-600 hover:text-red-400 text-2xl font-normal transition-colors duration-200"
            >
              Our Work
            </Link>
            <Link 
              href="/contact" 
              className="text-red-600 hover:text-red-400 text-2xl font-normal transition-colors duration-200"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden ml-auto pr-4 relative z-[120]">
            <button
              onClick={toggleMenu}
              className="p-3 rounded-md text-red-600 hover:text-red-400 focus:outline-none transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle main menu</span>
              <div className="w-8 h-8 relative">
                <span
                  className={`absolute h-1 w-8 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-3.5' : 'translate-y-1'
                  }`}
                />
                <span
                  className={`absolute h-1 w-8 bg-current rounded-full transform transition-all duration-300 ease-in-out translate-y-3.5 ${
                    isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                />
                <span
                  className={`absolute h-1 w-8 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 translate-y-3.5' : 'translate-y-6'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Phone Number - Desktop */}
          <div className="hidden lg:block absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <a 
              href="tel:+1234567890" 
              className="text-red-600 hover:text-red-400 text-lg font-medium transition-colors duration-200"
            >
              📞 (631) 764-1577
            </a>
          </div>

          {/* Phone Number - Mobile (Outside hamburger menu) - PROPER SPACING */}
          <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <a 
              href="tel:+1234567890" 
              className="text-red-600 hover:text-red-400 text-lg font-medium transition-colors duration-200"
            >
              📞 (631) 764-1577
            </a>
          </div>
        </div>

        {/* Mobile Menu - SLIDES DOWN FROM NAVBAR - CENTERED LINKS */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out relative z-[110] ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-black border-t border-red-600">
            <div className="px-6 py-8 space-y-2 text-center">
              <div className="py-4 px-6 rounded-lg transition-all duration-300">
                <Link
                  href="/#"
                  className="inline-block text-2xl font-normal text-red-600 hover:text-red-400 transition-all duration-300 transform hover:scale-105"
                  onClick={toggleMenu}
                >
                  About Us
                </Link>
              </div>
              <div className="py-4 px-6 rounded-lg transition-all duration-300 relative">
                <div className="flex flex-col items-center justify-center relative">
                  <button
                    className="text-2xl font-normal text-red-600 hover:text-red-400 transition-all duration-300 transform hover:scale-105"
                    onClick={handleMobileServicesClick}
                    type="button"
                  >
                    Services
                  </button>
                  <button
                    className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 p-2 text-red-600 hover:text-white hover:bg-red-600 rounded transition-all duration-300"
                    onClick={() => setIsMobileServicesDropdownOpen(!isMobileServicesDropdownOpen)}
                    type="button"
                  >
                    <svg className={`w-6 h-6 transition-transform ${isMobileServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                    </svg>
                  </button>
                </div>

                {isMobileServicesDropdownOpen && (
                  <div className="mt-4 bg-gray-900 border border-gray-800 rounded-md shadow-lg">
                    {services.map(service => (
                      <button
                        key={service.slug}
                        className="block w-full text-center px-4 py-3 text-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors font-normal border-b border-gray-800 last:border-b-0"
                        onClick={() => handleServiceJump(normalizeSlug(service.title))}
                        type="button"
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="py-4 px-6 rounded-lg transition-all duration-300">
                <Link
                  href="/work"
                  className="inline-block text-2xl font-normal text-red-600 hover:text-red-400 transition-all duration-300 transform hover:scale-105"
                  onClick={toggleMenu}
                >
                  Our Work
                </Link>
              </div>
              <div className="py-4 px-6 rounded-lg transition-all duration-300">
                <Link
                  href="/contact"
                  className="inline-block text-2xl font-normal text-red-600 hover:text-red-400 transition-all duration-300 transform hover:scale-105"
                  onClick={toggleMenu}
                >
                  Request a Quote
                </Link>
              </div>
              
              {/* Phone Number - Mobile Menu with spacing */}
              <div className="pt-12 mt-8 border-t border-red-600 border-opacity-30">
                <a 
                  href="tel:+1234567890" 
                  className="inline-block text-red-600 hover:text-red-400 text-xl font-medium transition-colors duration-200"
                >
                  📞 (631) 764-1577
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Overlay - FULL BLACK BACKGROUND */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black z-[90]"
          onClick={toggleMenu}
        />
      )}

      {/* SPACER DIV TO PREVENT CONTENT FROM HIDING UNDER FIXED NAV */}
      <div className="h-48 lg:h-44"></div>
    </>
  );
};

export default Navbar;
