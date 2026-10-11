"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// 3D glass cube — heavy WebGL scene, loads client-side only.
const GlassCube = dynamic(() => import("@/components/3d/GlassCube"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        color: "var(--color-text-tertiary)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      Loading 3D Cube...
    </div>
  ),
});

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".about-anim") ?? [];
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Portrait clip-path reveal
      gsap.from(".about-portrait", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".about-portrait",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      aria-label="About Nikhil"
    >
      <div className="about-grid">
        {/* Portrait */}
        <div>
          <div className="about-portrait">
            <GlassCube />
            <div className="about-portrait-label" style={{ zIndex: 2, fontWeight: 500 }}>
              Nikhil — Delhi NCR, India — 2026
            </div>
          </div>

          {/* Mini facts below portrait */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1.5rem",
            }}
          >
            {[
              { label: "Education", value: "B.Tech CS&E" },
              { label: "CGPA", value: personalInfo.education.cgpa },
              { label: "Year", value: personalInfo.education.period.split("—")[1].trim() },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="fact-label">{label}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                    marginTop: "0.25rem",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="about-content">
          <span className="section-num about-anim">// 03</span>

          <h2 className="about-intro about-anim">
            I build products that are&nbsp;
            <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>
              technically solid
            </span>
            &nbsp;and&nbsp;
            <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>
              visually refined.
            </span>
          </h2>

          {personalInfo.bioExtended.map((para, i) => (
            <p key={i} className="about-body about-anim">
              {para}
            </p>
          ))}

          {/* Fact grid */}
          <div className="about-facts">
            {[
              { label: "Location", value: personalInfo.location },
              { label: "Email", value: personalInfo.email },
              { label: "University", value: "DCRUST Murthal" },
              { label: "Availability", value: "Open · 2026" },
              { label: "GitHub", value: "nikhilcodeworks" },
            ].map(({ label, value }) => (
              <div key={label} className="fact-item about-anim">
                <span className="fact-label">{label}</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
