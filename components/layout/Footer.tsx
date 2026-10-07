"use client";
import Link from "next/link";
import { personalInfo } from "@/lib/data";

const socialLinks = [
  { label: "GitHub", href: personalInfo.github },
  { label: "LinkedIn", href: personalInfo.linkedin },
  { label: "Email", href: `mailto:${personalInfo.email}` },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Left */}
      <div className="footer__left">
        <span className="footer__name">{personalInfo.fullName}</span>
        <span className="footer__meta">
          {personalInfo.location} · {personalInfo.education.period.split("—")[1].trim()}
        </span>
      </div>

      {/* Center */}
      <p className="footer__center">
        Designed &amp; built with curiosity, code and too many iterations.
        <br />
        <span style={{ opacity: 0.5 }}>© 2026 Nikhil. All rights reserved.</span>
      </p>

      {/* Right */}
      <nav className="footer__right" aria-label="Social links">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="footer__link"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={`Visit ${label}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
