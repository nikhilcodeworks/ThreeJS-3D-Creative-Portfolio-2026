"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

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
            <Image
              src="/portrait.webp"
              alt="Nikhil — Full Stack Developer & Creative Engineer"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 40%)",
                pointerEvents: "none",
              }}
            />
            <div className="about-portrait-label" style={{ color: "#ffffff", zIndex: 2, fontWeight: 500 }}>
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
              { label: "Studio", value: personalInfo.studio },
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
