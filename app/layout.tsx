"use client";

import Navbar from "@/components/nav";
import "./globals.css";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white shadow-lg border-2 border-red-600 transition-opacity duration-300 hover:bg-red-600 hover:text-white ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll to top"
        >
          {/* Up arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <Footer/>
      </body>
    </html>
  );
}
