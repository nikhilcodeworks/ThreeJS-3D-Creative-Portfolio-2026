"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".timeline-item") ?? [];
      items.forEach((item) => {
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section"
      style={{ padding: "8rem 2.5rem", maxWidth: "none" }}
      aria-label="Work experience"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
          <span className="section-num">// 05</span>
          <h2
            className="text-display-lg"
            style={{ color: "var(--color-text-primary)" }}
          >
            Experience
          </h2>
        </div>

        {/* Timeline */}
        <div className="timeline" role="list">
          {experience.map((item, idx) => (
            <article
              key={idx}
              className="timeline-item"
              role="listitem"
              aria-label={`${item.role} at ${item.company}`}
            >
              {/* Left: Year */}
              <div className="timeline-year" aria-label={`Period: ${item.year}`}>
                {item.year}
              </div>

              {/* Right: Details */}
              <div>
                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-company">{item.company}</p>
                <p className="timeline-desc">{item.description}</p>

                {/* Tech stack tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "1.25rem",
                  }}
                  aria-label="Technologies used"
                >
                  {item.tech.map((t) => (
                    <span key={t} className="project-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Education append */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "4rem",
            borderTop: "1px solid var(--color-border)",
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: "3rem",
          }}
        >
          <div className="timeline-year">2020 — 2024</div>
          <div>
            <h3 className="timeline-role">B.Tech in CS&amp;E</h3>
            <p className="timeline-company">
              Deenbandhu Chhotu Ram University (DCRUST) · Murthal, Haryana
            </p>
            <p className="timeline-desc">
              Computer Science &amp; Engineering. CGPA: 7.6/10.0. Gained
              foundation in data structures, algorithms, databases, and web
              development. Built multiple production-level projects during
              internships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
