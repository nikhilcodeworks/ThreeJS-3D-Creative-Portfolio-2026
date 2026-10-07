"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header
      ref={navRef}
      className={`nav ${scrolled ? "scrolled" : ""}`}
      role="banner"
    >
      {/* Logo */}
      <Link
        href="/"
        className="nav__logo"
        aria-label="Nikhil — Home"
      >
        Nikhil<span>.</span>
      </Link>

      {/* Desktop nav links */}
      <nav aria-label="Main navigation">
        <ul className="nav__links">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a
                className="nav__link"
                href={href}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-text-tertiary)",
        }}
        aria-label="Currently available for work"
      >
        <span
            style={{
              width: 5,
              height: 5,
              background: "#555",
              borderRadius: "50%",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
        Available
      </div>
    </header>
  );
}
