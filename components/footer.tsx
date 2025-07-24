// components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin } from 'lucide-react';

const services = [
  { title: "LANDSCAPE & OUTDOOR LIGHTING", slug: "landscape-outdoor-lighting" },
  { title: "POOL & SAUNA ELECTRICAL", slug: "pool-sauna-electrical" },
  { title: "RESIDENTIAL ELECTRICAL SERVICES", slug: "residential-electrical-services" },
  { title: "COMMERCIAL ELECTRICAL SOLUTIONS", slug: "commercial-electrical-solutions" },
];

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleServiceJump = (slug: string) => {
    if (pathname === '/services') {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(`/services#${slug}`);
    }
  };

  return (
    <footer className="bg-black text-white">
        {/* Call to Action Section */}
      <div className="bg-red-600 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Power Your Property?
          </h3>
          <p className="text-red-100 mb-6 text-lg">
            Get your free estimate today and experience professional electrical service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Free Estimate →
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Call Now: (631) 764-15770
            </a>
          </div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="relative h-20 w-64">
                <Image
                  src="/logo.PNG"
                  alt="CRC Electrical Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Professional electrical services across Long Island. Licensed, insured, and committed to powering your property with expert solutions.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                {/* Custom Instagram SVG since the Lucide one is deprecated */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/work" 
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map(service => (
                <li key={service.slug}>
                  <button
                    onClick={() => handleServiceJump(normalizeSlug(service.title))}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Call Us</p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-white font-semibold hover:text-red-400 transition-colors duration-200"
                  >
                    (631) 764-15770
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Email Us</p>
                  <a 
                    href="mailto:crcelectriccorp@gmail.comal.com" 
                    className="text-white font-semibold hover:text-red-400 transition-colors duration-200"
                  >
                    crcelectriccorp@gmail.comal.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Service Area</p>
                  <p className="text-white font-semibold">Long Island, NY</p>
                  <p className="text-gray-400 text-sm">Suffolk & Nassau County</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Emergency Service</p>
                  <p className="text-white font-semibold">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CRC Electrical. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
