"use client";

import Navbar from "@/components/nav";
import "./globals.css";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Head from "next/head";

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
      <Head>
        {/* HTML Meta Tags */}
        <title>CRC Electric | Expert Electrical Services in Long Island, NY</title>
        <meta name="description" content="CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!" />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://crcelectriccorp.com/home" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CRC Electric | Expert Electrical Services in Long Island, NY" />
        <meta property="og:description" content="CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!" />
        <meta property="og:image" content="/logo.PNG" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="crcelectriccorp.com" />
        <meta property="twitter:url" content="https://crcelectriccorp.com/home" />
        <meta name="twitter:title" content="CRC Electric | Expert Electrical Services in Long Island, NY" />
        <meta name="twitter:description" content="CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!" />
        <meta name="twitter:image" content="/logo.PNG" />
      </Head>
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
