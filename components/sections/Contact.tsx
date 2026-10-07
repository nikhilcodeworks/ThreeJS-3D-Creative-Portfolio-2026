"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".contact-anim") ?? [];
      gsap.from(items, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
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
      id="contact"
      className="contact-section"
      aria-label="Contact section"
    >
      <div className="contact-inner">
        {/* Section label */}
        <span className="section-num contact-anim" style={{ display: "block", marginBottom: "2rem" }}>
          // 08 — Contact
        </span>

        {/* Main headline */}
        <h2 className="contact-headline contact-anim">
          Have something
          <br />
          worth{" "}
          <em>building?</em>
        </h2>

        {/* Sub */}
        <p className="contact-sub contact-anim">
          I&apos;m open to full-time roles, freelance projects, and interesting
          collaborations. If you&apos;re building something meaningful, let&apos;s
          talk.
        </p>

        {/* Links */}
        <div className="contact-links contact-anim">
          {[
            { label: "Email", href: `mailto:${personalInfo.email}`, text: personalInfo.email },
            { label: "GitHub", href: personalInfo.github, text: "nikhilcodeworks" },
            { label: "LinkedIn", href: personalInfo.linkedin, text: "nikhilcodes01" },
          ].map(({ label, href, text }) => (
            <a
              key={label}
              href={href}
              className="contact-link"
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={`${label}: ${text}`}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  color: "var(--color-text-tertiary)",
                  letterSpacing: "0.1em",
                }}
              >
                {label}
              </span>
              <span>{text}</span>
            </a>
          ))}
        </div>

        {/* Main CTA */}
        <div className="contact-anim">
          <a
            href={`mailto:${personalInfo.email}`}
            className="contact-cta magnetic-btn"
            aria-label="Start a conversation via email"
          >
            Start a Conversation
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Location note */}
        <p
          className="contact-anim"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-text-tertiary)",
            marginTop: "3rem",
          }}
        >
          Based in {personalInfo.location} · Available Worldwide (Remote)
        </p>
      </div>
    </section>
  );
}
