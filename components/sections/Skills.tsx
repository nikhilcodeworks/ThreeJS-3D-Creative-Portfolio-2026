"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { key: "frontend" as const, label: "Frontend", prefix: "01" },
  { key: "backend" as const, label: "Backend", prefix: "02" },
  { key: "tools" as const, label: "Tools & Platforms", prefix: "03" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".skill-category",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-section"
      aria-label="Technical skills"
    >
      {/* Header */}
      <div
        className="skills-header-row"
        style={{
          maxWidth: 1400,
          margin: "0 auto 3.5rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div>
          <span className="section-num">// 04</span>
          <h2
            className="text-display-lg"
            style={{ color: "var(--color-text-primary)" }}
          >
            Then I turn the interface
            <br />
            <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>
              into something that moves.
            </span>
          </h2>
        </div>

        {/* Terminal-style badge */}
        <div
          className="skills-terminal-badge"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            letterSpacing: "0.1em",
            color: "var(--color-accent)",
            border: "1px solid var(--color-accent-dim)",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            background: "rgba(37, 99, 235, 0.04)",
          }}
          aria-hidden="true"
        >
          $ nikhil --skills --list
        </div>
      </div>

      {/* Skills grid */}
      <div className="skills-grid" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {categories.map(({ key, label, prefix }) => (
          <div key={key} className="skill-category">
            <div className="skill-category-title">
              {prefix} — {label}
            </div>
            <ul className="skill-list" aria-label={`${label} skills`}>
              {(skills[key] || []).map((skill) => (
                <li key={skill} className="skill-item">
                  <span>{skill}</span>
                  <span className="skill-dot" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom stats row */}
      <div
        className="skills-stats-row"
        style={{
          maxWidth: 1400,
          margin: "3.5rem auto 0",
          padding: "2rem 2.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
        aria-hidden="true"
      >
        {[
          ["Experience", "2+ years"],
          ["Projects Shipped", "10+"],
          ["Lines of Code", "∞"],
          ["Clients Served", "5+"],
        ].map(([label, value]) => (
          <div key={label} className="skills-stat-box">
            <div className="fact-label">{label}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
                marginTop: "0.25rem",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
