"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".about-anim") ?? [];
      
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        ".about-portrait",
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-portrait",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const rawPeriod = personalInfo.education?.period || "2020 — 2024";
  const gradYear = rawPeriod.includes("—")
    ? rawPeriod.split("—")[1]?.trim() || "2024"
    : rawPeriod.includes("-")
    ? rawPeriod.split("-")[1]?.trim() || "2024"
    : rawPeriod;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      aria-label="About Nikhil"
      style={{ position: "relative", zIndex: 20, background: "#f9f9f9" }}
    >
      <div className="about-grid">
        {/* Left Column: Developer Card Profile */}
        <div>
          <div className="about-portrait" style={{ position: "relative", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.2)", background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)" }}>
            {/* Ambient decorative glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-20%",
                left: "-20%",
                width: "140%",
                height: "140%",
                background: "radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.25) 0%, rgba(34, 211, 238, 0.1) 40%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Content inside card */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "2rem",
                color: "#ffffff",
              }}
            >
              {/* Card top */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#94a3b8" }}>
                  IDENTITY // 03
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "#4ade80",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
                  AVAILABLE
                </span>
              </div>

              {/* Center Monogram / Name */}
              <div style={{ textAlign: "center", margin: "auto 0" }}>
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    margin: "0 auto 1.25rem",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
                    NK
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.25rem", color: "#f8fafc" }}>
                  {personalInfo.fullName || personalInfo.name}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#38bdf8", margin: 0 }}>
                  {personalInfo.role}
                </p>
              </div>

              {/* Card Footer tags */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#94a3b8" }}>
                  {personalInfo.location}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#60a5fa" }}>
                  MERN · Next.js · Three.js
                </span>
              </div>
            </div>
          </div>

          {/* Mini facts below portrait */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1.5rem",
              background: "#ffffff",
              padding: "1rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
            }}
          >
            {[
              { label: "Education", value: "B.Tech CS&E" },
              { label: "CGPA", value: personalInfo.education?.cgpa || "7.6/10" },
              { label: "Grad Year", value: gradYear },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="fact-label">{label}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
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

          {(personalInfo.bioExtended || []).map((para, i) => (
            <p key={i} className="about-body about-anim">
              {para}
            </p>
          ))}

          {/* Fact grid */}
          <div className="about-facts">
            {[
              { label: "Location", value: personalInfo.location },
              { label: "Email", value: personalInfo.email },
              { label: "University", value: personalInfo.education?.institution ? personalInfo.education.institution.replace("Deenbandhu Chhotu Ram University (DCRUST)", "DCRUST Murthal") : "DCRUST Murthal" },
              { label: "Availability", value: personalInfo.availability || "Open · 2026" },
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
