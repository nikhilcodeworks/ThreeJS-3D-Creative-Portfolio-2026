"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic sticky stacking calculation matching reference (Creative Thoughts AI)
  useEffect(() => {
    const applyStickyPositions = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll<HTMLElement>(".cti_saas_card");
      if (!cards.length) return;

      const isDesktop = window.matchMedia("(min-width: 992px)").matches;
      const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 991px)").matches;

      // Base top distance from viewport top (accounts for fixed navbar)
      const baseTop = isDesktop ? 110 : isTablet ? 85 : 70;
      // Incremental step between stacked cards so each header bar peeks out
      const step = isDesktop ? 60 : isTablet ? 40 : 25;

      cards.forEach((card, idx) => {
        const topVal = baseTop + step * idx;
        card.style.setProperty("--stick-top", `${topVal}px`);
        card.style.top = `${topVal}px`;
        card.style.zIndex = String(idx + 1);
      });

      // Recalculate ScrollTrigger triggers
      ScrollTrigger.refresh();
    };

    applyStickyPositions();
    window.requestAnimationFrame(applyStickyPositions);
    const timer = setTimeout(applyStickyPositions, 200);

    window.addEventListener("resize", applyStickyPositions);
    window.addEventListener("load", applyStickyPositions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", applyStickyPositions);
      window.removeEventListener("load", applyStickyPositions);
    };
  }, []);

  useGSAP(
    () => {
      // Header reveal animation
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-section"
      aria-label="Work and projects"
      style={{ overflow: "visible", position: "relative", zIndex: 5 }}
    >
      {/* Section Header */}
      <div ref={headerRef} className="work-header">
        <div>
          <span className="section-num">// 02</span>
          <h2 className="text-display-lg" style={{ color: "var(--color-text-primary)" }}>
            Selected Work
          </h2>
        </div>
        <div className="work-header-right" style={{ maxWidth: 360 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-text-tertiary)",
              lineHeight: 1.6,
              marginBottom: "8px",
            }}
          >
            A curated selection of production software — engineered with scalable architectures, modern stacks, and immersive interactive design.
          </p>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-interactive)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--color-interactive)",
              }}
            ></span>
            Scroll to cascade project stack ↓
          </span>
        </div>
      </div>

      {/* Main Sticky Cascading Scroll Container */}
      <div
        ref={containerRef}
        id="stickybox"
        className="ct_sticky_scroll_main"
        role="list"
        style={{ overflow: "visible" }}
      >
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const stats = (project as any).stats as { label: string; sub: string }[] | undefined;
  const themeClass = (project as any).themeClass || "is_blue";
  const image = (project as any).image || "/projects/dummy_img_1_new.webp";
  const badge = (project as any).badge || project.category;

  // Base top 110px and 60px step matching reference
  const initialTop = 110 + index * 60;
  const zIndexVal = index + 1;

  return (
    <article
      className={`cti_saas_card ${themeClass}`}
      role="listitem"
      aria-label={`Project: ${project.fullTitle}`}
      style={{
        position: "sticky",
        top: `var(--stick-top, ${initialTop}px)`,
        zIndex: zIndexVal,
        ["--stick-top" as any]: `${initialTop}px`,
        ["--stick-z" as any]: zIndexVal,
      }}
    >
      {/* Left Column: Content */}
      <div className="cti_content">
        <div>
          {/* Card Top Peek Bar - Visible as cards stack */}
          <div className="cti_card_header_bar">
            <span className="cti_badge">
              <span className="cti_badge_dot"></span>
              {badge}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="cti_card_year">{project.year}</span>
              <span className="cti_card_num">#{project.num}</span>
            </div>
          </div>

          {/* Heading */}
          <h3 className="cti_heading">{project.title}</h3>

          {/* Description */}
          <p className="cti_desc">{project.description}</p>

          {/* Stat Highlight Boxes */}
          {stats && stats.length > 0 && (
            <div className="cti_stats_wrapper">
              {stats.map((stat, idx) => (
                <div key={idx} className="cti_stat_box">
                  <h4>{stat.label}</h4>
                  <p>{stat.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="cti_tech_tags">
            {project.tags.map((tag) => (
              <span key={tag} className="cti_tech_pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cti_actions">
          <Link
            href={`/work/${project.slug}`}
            className="cti_build_btn"
            aria-label={`View ${project.fullTitle} case study`}
          >
            <span>View Case Study</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          {project.githubUrl && project.githubUrl !== "#" && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cti_github_btn"
              aria-label={`View source code on GitHub for ${project.fullTitle}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Preview Image */}
      <div className="ct_sass_card_img">
        <div className="ct_card_img_wrapper">
          <Image
            src={image}
            alt={`${project.fullTitle} Interface Preview`}
            width={640}
            height={420}
            priority={project.num === "01"}
            loading={project.num === "01" ? "eager" : "lazy"}
            className="w-full h-auto object-cover"
            onLoad={() => {
              ScrollTrigger.refresh();
            }}
          />
        </div>
      </div>
    </article>
  );
}
