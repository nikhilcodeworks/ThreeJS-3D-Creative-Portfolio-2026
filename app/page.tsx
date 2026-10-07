"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Sections
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import CodeShowcase from "@/components/sections/CodeShowcase";
import Principles from "@/components/sections/Principles";
import Contact from "@/components/sections/Contact";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/sections/Loader";

// Custom cursor (no SSR — uses window APIs)
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

// GSAP registration
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = () => {
    setLoading(false);
    // Refresh ScrollTrigger after loader exits
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  };

  return (
    <>
      {/* Cinematic loader */}
      {loading && <Loader onComplete={handleLoaderComplete} />}

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Main content */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {/* Floating navigation */}
        <Navbar />

        <main id="main-content" role="main">
          {/* 01 — Hero */}
          <Hero />

          {/* Marquee divider */}
          <Marquee />

          {/* 02 — Work */}
          <Work />

          {/* 03 — About */}
          <About />

          {/* 04 — Skills */}
          <Skills />

          {/* 05 — Experience */}
          <Experience />

          {/* 06 — Code Showcase */}
          <CodeShowcase />

          {/* 07 — Principles */}
          <Principles />

          {/* Second marquee */}
          <Marquee />

          {/* 08 — Contact */}
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
