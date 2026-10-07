"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const codeLines = [
  { ln: "1",  tokens: [{ type: "c-comment", text: "// experience.ts — Nikhil's digital DNA" }] },
  { ln: "2",  tokens: [] },
  { ln: "3",  tokens: [{ type: "c-keyword", text: "const" }, { type: "", text: " " }, { type: "c-variable", text: "developer" }, { type: "c-brace", text: " = {" }] },
  { ln: "4",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "name" }, { type: "c-brace", text: ": " }, { type: "c-string", text: '"Nikhil"' }, { type: "c-brace", text: "," }] },
  { ln: "5",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "stack" }, { type: "c-brace", text: ": [" }, { type: "c-string", text: '"MERN"' }, { type: "c-brace", text: ", " }, { type: "c-string", text: '"Next.js"' }, { type: "c-brace", text: ", " }, { type: "c-string", text: '"TypeScript"' }, { type: "c-brace", text: "]," }] },
  { ln: "6",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "fullStack" }, { type: "c-brace", text: ": " }, { type: "c-boolean", text: "true" }, { type: "c-brace", text: "," }] },
  { ln: "7",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "aiIntegration" }, { type: "c-brace", text: ": " }, { type: "c-boolean", text: "true" }, { type: "c-brace", text: "," }] },
  { ln: "8",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "production" }, { type: "c-brace", text: ": " }, { type: "c-boolean", text: "true" }, { type: "c-brace", text: "," }] },
  { ln: "9",  tokens: [{ type: "", text: "  " }, { type: "c-property", text: "users" }, { type: "c-brace", text: ": " }, { type: "c-string", text: '"500+"' }, { type: "c-brace", text: "," }] },
  { ln: "10", tokens: [{ type: "", text: "  " }, { type: "c-property", text: "ships" }, { type: "c-brace", text: "() {" }] },
  { ln: "11", tokens: [{ type: "", text: "    " }, { type: "c-keyword", text: "return" }, { type: "c-string", text: ' "fast & clean"' }, { type: "c-brace", text: ";" }] },
  { ln: "12", tokens: [{ type: "c-brace", text: "  }," }] },
  { ln: "13", tokens: [{ type: "c-brace", text: "};" }] },
  { ln: "14", tokens: [] },
  { ln: "15", tokens: [{ type: "c-comment", text: "// Available for new opportunities" }] },
];

export default function CodeShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = sectionRef.current?.querySelectorAll(".code-line") ?? [];
      gsap.fromTo(
        lines,
        { x: -16, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".code-content-right",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <div
      ref={sectionRef}
      className="code-section"
      id="code"
      aria-label="Code showcase"
    >
      <div className="code-section-inner">
        {/* Code window */}
        <div className="code-window" role="img" aria-label="Code snippet showing developer attributes">
          {/* Traffic lights bar */}
          <div className="code-window__bar" aria-hidden="true">
            <div className="code-window__dot" style={{ background: "#ff5f57" }} />
            <div className="code-window__dot" style={{ background: "#ffbd2e" }} />
            <div className="code-window__dot" style={{ background: "#28c840" }} />
            <span className="code-window__filename">experience.ts</span>
          </div>

          {/* Code content */}
          <div className="code-window__content" aria-hidden="true">
            {codeLines.map((line) => (
              <div key={line.ln} className="code-line">
                <span className="code-ln">{line.ln}</span>
                <span>
                  {line.tokens.map((token, i) => (
                    <span key={i} className={token.type}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: text content */}
        <div className="code-content-right">
          <span className="section-num">// 06</span>
          <h2 className="text-display-md" style={{ color: "var(--color-text-primary)", marginBottom: "1.5rem" }}>
            Clean code isn&apos;t just{" "}
            <em style={{ color: "var(--color-accent)" }}>readable.</em>
            <br />
            It&apos;s maintainable.
          </h2>
          <p className="text-body-lg" style={{ marginBottom: "2rem" }}>
            I write code that my future self (and teammates) won&apos;t curse at.
            Component-first thinking, clear naming, and sensible architecture are
            non-negotiables.
          </p>

          {/* Certifications */}
          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: "2rem",
            }}
          >
            <span className="text-label" style={{ display: "block", marginBottom: "1.5rem" }}>
              Certifications
            </span>
            {[
              { name: "The Complete Web Development Bootcamp", org: "Udemy · Angela Yu", year: "2024" },
              { name: "Freedom With AI Masterclass", org: "2025", year: "2025" },
              { name: "Figma Essential Training", org: "LinkedIn Learning", year: "2025" },
            ].map((cert) => (
              <div
                key={cert.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--color-text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.625rem",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-tertiary)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {cert.org}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    color: "var(--color-accent)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {cert.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
