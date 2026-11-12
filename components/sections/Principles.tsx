"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { principles } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.from(".principle-card", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  const toggleCard = (num: string) => {
    setExpandedCard((prev) => (prev === num ? null : num));
  };

  return (
    <section
      ref={sectionRef}
      id="principles"
      className="section principles-section"
      aria-label="Work principles"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span className="section-num">// 07</span>
          <h2
            className="text-display-lg"
            style={{ color: "var(--color-text-primary)" }}
          >
            I care about&hellip;
          </h2>
        </div>

        {/* Grid */}
        <div className="principles-grid" role="list">
          {principles.map((p) => {
            const isExpanded = expandedCard === p.num;
            return (
              <article
                key={p.num}
                className={`principle-card ${isExpanded ? "is-expanded" : ""}`}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${p.word}: ${p.desc}`}
                onClick={() => toggleCard(p.num)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(p.num);
                  }
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="principle-card__num">{p.num}</div>
                  <span
                    className="principle-toggle-icon"
                    aria-hidden="true"
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: 1,
                      color: isExpanded ? "var(--color-interactive-strong)" : "var(--color-text-tertiary)",
                      fontWeight: 300,
                      transition: "transform 0.25s ease, color 0.25s ease",
                      transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </div>
                <div className="principle-card__word">{p.word}</div>
                <p className="principle-card__desc">
                  {p.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
