"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".cs-anim", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
    });

    document.querySelectorAll(".cs-section").forEach((section) => {
      gsap.from(section, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });
    });
  }, { scope: heroRef });

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main id="main-content" role="main">
        {/* ─── Case Study Hero ─── */}
        <div
          ref={heroRef}
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 2.5rem 5rem",
            borderBottom: "1px solid var(--color-border)",
            paddingTop: "10rem",
            background: `linear-gradient(to bottom, #080808, var(--color-bg-secondary))`,
          }}
        >
          {/* Back link */}
          <Link
            href="/#work"
            className="cs-anim"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "3rem",
              transition: "color 0.25s",
            }}
            aria-label="Back to all projects"
          >
            ← All Projects
          </Link>

          {/* Project number */}
          <div
            className="cs-anim"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--color-accent)",
              letterSpacing: "0.1em",
              marginBottom: "1.5rem",
            }}
          >
            {project.num} — Case Study
          </div>

          {/* Title */}
          <h1
            className="cs-anim text-display-xl"
            style={{ maxWidth: 1000 }}
          >
            {project.fullTitle}
          </h1>

          {/* Meta row */}
          <div
            className="cs-anim"
            style={{
              display: "flex",
              gap: "4rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Category", value: project.category },
              { label: "Role", value: project.role },
              { label: "Year", value: project.year },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="fact-label">{label}</div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-text-primary)",
                    marginTop: "0.375rem",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}

            {/* Tech tags */}
            <div>
              <div className="fact-label">Stack</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.375rem",
                }}
              >
                {project.tech.map((t) => (
                  <span key={t} className="project-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="cs-anim" style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View live project"
              >
                View Live
              </a>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                className="btn-outline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* ─── Overview ─── */}
        <section
          className="cs-section"
          style={{
            padding: "6rem 2.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
          aria-label="Project overview"
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: "var(--color-text-primary)",
              maxWidth: 900,
            }}
          >
            {project.description}
          </p>
        </section>

        <div className="divider" style={{ maxWidth: 1200, margin: "0 auto" }} />

        {/* ─── Case Study Sections ─── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem" }}>
          {project.sections.map((section, idx) => (
            <article
              key={idx}
              className="cs-section"
              style={{
                padding: "5rem 0",
                borderBottom:
                  idx < project.sections.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "4rem",
                alignItems: "start",
              }}
              aria-label={section.title}
            >
              {/* Section number/title */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    color: "var(--color-accent)",
                    letterSpacing: "0.1em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {section.title.split("—")[0].trim()}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {section.title.split("—")[1]?.trim()}
                </div>
              </div>

              {/* Content */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.0625rem",
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: "var(--color-text-secondary)",
                    marginBottom: "2rem",
                  }}
                >
                  {section.content}
                </p>

                {/* Visual placeholder */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 7",
                    background: "var(--color-surface)",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-tertiary)",
                  }}
                  aria-hidden="true"
                >
                  Visual / Screenshot — {section.title.split("—")[1]?.trim()}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── Challenge + Outcome ─── */}
        <section
          style={{
            padding: "6rem 2.5rem",
            background: "var(--color-bg-secondary)",
            borderTop: "1px solid var(--color-border)",
          }}
          aria-label="Challenge and outcome"
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6rem",
            }}
          >
            <div className="cs-section">
              <div className="fact-label" style={{ marginBottom: "1rem" }}>
                The Challenge
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.0625rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                {project.challenge}
              </p>
            </div>
            <div className="cs-section">
              <div className="fact-label" style={{ marginBottom: "1rem" }}>
                The Outcome
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.0625rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                {project.outcome}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Next project CTA ─── */}
        <section
          style={{
            padding: "6rem 2.5rem",
            textAlign: "center",
            borderTop: "1px solid var(--color-border)",
          }}
          aria-label="Navigation to next project"
        >
          <div className="fact-label" style={{ marginBottom: "1.5rem" }}>
            Next Project
          </div>
          {(() => {
            const currentIdx = projects.findIndex((p) => p.slug === slug);
            const next = projects[(currentIdx + 1) % projects.length];
            return (
              <Link href={`/work/${next.slug}`} style={{ textDecoration: "none" }}>
                <h2
                  className="text-display-md"
                  style={{
                    color: "var(--color-text-primary)",
                    transition: "color 0.3s",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget.style.color = "var(--color-accent)"))}
                  onMouseLeave={(e) =>
                    ((e.currentTarget.style.color = "var(--color-text-primary)"))}
                >
                  {next.title} →
                </h2>
              </Link>
            );
          })()}
        </section>
      </main>

      <Footer />
    </>
  );
}
