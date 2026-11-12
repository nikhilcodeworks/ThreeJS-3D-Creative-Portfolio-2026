"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience, education } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".timeline-item") ?? [];
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section experience-section"
      aria-label="Work experience"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
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
              <div className="timeline-date timeline-year" aria-label={`Period: ${item.year}`}>
                {item.year}
              </div>

              {/* Right: Details */}
              <div className="timeline-content">
                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-company">
                  {item.company} {item.location ? `· ${item.location}` : ""}
                </p>
                <p className="timeline-desc">{item.description}</p>

                {/* Tech stack tags */}
                {item.tech && item.tech.length > 0 && (
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
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Education append */}
        <div
          className="timeline-item timeline-education"
          style={{
            marginTop: "3.5rem",
            paddingTop: "3.5rem",
            borderTop: "1px solid var(--color-border)",
          }}
          role="article"
          aria-label={`Education: ${education.degree}`}
        >
          <div className="timeline-date timeline-year">{education.period}</div>
          <div className="timeline-content">
            <h3 className="timeline-role">{education.degree}</h3>
            <p className="timeline-company">
              {education.institution} · {education.location}
            </p>
            <p className="timeline-desc">
              CGPA: {education.cgpa}. {education.desc || "Gained strong foundation in computer science and full-stack engineering."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
