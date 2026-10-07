"use client";
import { Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Dynamically import the 3D scene — heavy, only loads client-side
const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-tertiary)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      Loading 3D Scene...
    </div>
  ),
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(eyebrowRef.current, { y: 20, opacity: 0, duration: 0.8 }, 0.2)
        .from(
          titleRef.current?.querySelectorAll(".line-wrap") ?? [],
          { y: "110%", duration: 1, stagger: 0.08 },
          0.4
        )
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.8 }, 0.8)
        .from(statusRef.current, { y: 10, opacity: 0, duration: 0.6 }, 1.0)
        .from(ctaRef.current?.children ?? [], {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
        }, 1.1);
    },
    { scope: heroRef }
  );

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={heroRef} className="hero" id="hero" aria-label="Hero section">
      {/* Left: Content */}
      <div className="hero__content">
        {/* Eyebrow */}
        <div ref={eyebrowRef} className="hero__eyebrow">
          {personalInfo.eyebrow}
        </div>

        {/* Main headline */}
        <h1 ref={titleRef} className="hero__title" aria-label="Designing digital experiences that move.">
          <span className="overflow-hidden" style={{ display: "block" }}>
            <span className="line-wrap" style={{ display: "block" }}>
              Building digital
            </span>
          </span>
          <span className="overflow-hidden" style={{ display: "block" }}>
            <span className="line-wrap" style={{ display: "block" }}>
              products that
            </span>
          </span>
          <span className="overflow-hidden" style={{ display: "block" }}>
            <span className="line-wrap" style={{ display: "block" }}>
              <em>actually work.</em>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="hero__subtitle">
          {personalInfo.bio}
        </p>

        {/* Status */}
        <div ref={statusRef} className="hero__status">
          <span
            className="hero__status-dot"
            aria-hidden="true"
            style={{ background: "#555" }}
          />
          {personalInfo.availability}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="hero__ctas">
          <a
            href="#work"
            onClick={scrollToWork}
            className="btn-primary magnetic-btn"
            aria-label="Explore my work"
          >
            Explore Work
          </a>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="btn-outline magnetic-btn"
            aria-label="Contact me"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>

      {/* Right: 3D Scene */}
      <div className="hero__3d" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-line" />
        Scroll to explore
      </div>
    </section>
  );
}
