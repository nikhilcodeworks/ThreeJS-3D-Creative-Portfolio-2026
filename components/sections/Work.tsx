"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.from(headerRef.current?.children ?? [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      });

      // Each project row
      document.querySelectorAll(".project-row").forEach((row, i) => {
        gsap.from(row, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-section"
      aria-label="Work and projects"
    >
      {/* Header */}
      <div ref={headerRef} className="work-header">
        <div>
          <span className="section-num">// 02</span>
          <h2 className="text-display-lg" style={{ color: "var(--color-text-primary)" }}>
            Selected Work
          </h2>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-text-tertiary)",
            maxWidth: 280,
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          A selection of production projects — from platforms used by hundreds to
          client-commissioned websites.
        </p>
      </div>

      {/* Project list */}
      <div className="work-list" role="list">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project }: { project: (typeof projects)[0] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-row"
      ref={rowRef as any}
      role="listitem"
      aria-label={`View ${project.fullTitle} case study`}
      style={{ textDecoration: "none", display: "grid" }}
    >
      {/* Number */}
      <span className="project-num" aria-hidden="true">
        {project.num}
      </span>

      {/* Content */}
      <div>
        <h3 className="project-title">{project.title}</h3>

        {/* Tags */}
        <div className="project-meta">
          {project.category.split(" · ").map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="project-description">{project.description}</p>
      </div>

      {/* Year */}
      <span className="project-year" aria-label={`Year: ${project.year}`}>
        {project.year}
      </span>
    </Link>
  );
}
