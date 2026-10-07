"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { principles } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".principle-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="principles"
      className="section"
      style={{ padding: "8rem 2.5rem" }}
      aria-label="Work principles"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
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
          {principles.map((p) => (
            <article
              key={p.num}
              className="principle-card"
              role="listitem"
              tabIndex={0}
              aria-label={`${p.word}: ${p.desc}`}
            >
              <div className="principle-card__num">{p.num}</div>
              <div className="principle-card__word">{p.word}</div>
              <p className="principle-card__desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
